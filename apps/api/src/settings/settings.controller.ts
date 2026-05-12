import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { Roles } from '../user/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';
import { type AuthRequest } from '../user/types/expressRequest.interface';

const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get()
  async getSettings() {
    const settings = await this.settingsService.getSettings();
    return this.settingsService.generatedSettingsResponse(settings);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '..', 'uploads', 'logos'),
        filename: (_req, file, cb) => {
          const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Only PNG, JPG, WebP, and SVG images are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async updateSettings(
    @Body() dto: UpdateSettingsDto,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.id_user;
    const logoUrl = file ? `/uploads/logos/${file.filename}` : null;

    const settings = await this.settingsService.updateSettings(dto, logoUrl, userId);
    return this.settingsService.generatedSettingsResponse(settings);
  }
}
