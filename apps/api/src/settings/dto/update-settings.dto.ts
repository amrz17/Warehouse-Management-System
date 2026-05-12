import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  company_name?: string;

  @IsOptional()
  @IsString()
  warehouse_address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  timezone?: string;
}
