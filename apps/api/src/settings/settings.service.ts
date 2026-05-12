import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SettingsEntity } from './settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity)
    private readonly settingsRepo: Repository<SettingsEntity>,
    private readonly activityLogsService: ActivityLogsService,
    private readonly dataSource: DataSource,
  ) {}

  async getSettings(): Promise<SettingsEntity | null> {
    const settings = await this.settingsRepo.find({
      order: { created_at: 'ASC' },
      take: 1,
    });
    return settings[0] || null;
  }

  async updateSettings(
    dto: UpdateSettingsDto,
    logoUrl: string | null,
    userId: string,
  ): Promise<SettingsEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let settings = await this.getSettings();
      const before = settings ? { ...settings } : null;

      if (!settings) {
        settings = queryRunner.manager.create(SettingsEntity, {
          company_name: dto.company_name || 'My Company',
          warehouse_address: dto.warehouse_address || '',
          timezone: dto.timezone || 'Asia/Jakarta',
          logo_url: logoUrl,
        });
      } else {
        if (dto.company_name !== undefined) settings.company_name = dto.company_name;
        if (dto.warehouse_address !== undefined) settings.warehouse_address = dto.warehouse_address;
        if (dto.timezone !== undefined) settings.timezone = dto.timezone;
        if (logoUrl !== null) settings.logo_url = logoUrl;
      }

      const saved = await queryRunner.manager.save(settings);

      await this.activityLogsService.createLogs(queryRunner.manager, {
        id_user: userId,
        action: 'UPDATE',
        module: 'SETTINGS',
        resource_id: saved.id_settings,
        description: 'Updated company settings',
        metadata: {
          before,
          after: {
            company_name: saved.company_name,
            warehouse_address: saved.warehouse_address,
            timezone: saved.timezone,
            logo_url: saved.logo_url,
          },
        },
      });

      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  generatedSettingsResponse(settings: SettingsEntity | null) {
    return {
      success: true,
      settings: settings || {
        company_name: 'My Company',
        warehouse_address: '',
        timezone: 'Asia/Jakarta',
        logo_url: null,
      },
    };
  }
}
