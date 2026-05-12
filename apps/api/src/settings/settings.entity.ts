import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'settings' })
export class SettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  id_settings: string;

  @Column({ type: 'varchar', length: 255, nullable: false, default: 'My Company' })
  company_name: string;

  @Column({ type: 'text', nullable: true })
  warehouse_address: string;

  @Column({ type: 'varchar', length: 100, nullable: false, default: 'Asia/Jakarta' })
  timezone: string;

  @Column({ type: 'varchar', nullable: true })
  logo_url: string | null;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
