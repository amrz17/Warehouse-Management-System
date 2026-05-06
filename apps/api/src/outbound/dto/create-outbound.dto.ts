import { IsArray, IsDateString, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateOutboundItemDto } from "./create-ouboundItem.dto";

export class CreateOutbounddDto {
    @IsString()
    outbound_number: string;

    @IsUUID()
    id_so: string;

    @IsDateString()
    shipped_at: string;

    @IsOptional()
    @IsString()
    note: string;
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOutboundItemDto)
    items: CreateOutboundItemDto[];
}