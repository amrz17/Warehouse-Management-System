import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateActivityLogsDto {
    @IsUUID()
    id_user: string;

    @IsString()
    action: string;

    @IsString()
    module: string;

    @IsUUID()
    resource_id: string;

    @IsString()
    @IsOptional()
    description: string;
    
    @IsString()
    metadata: string;
}