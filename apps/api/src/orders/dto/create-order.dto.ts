import { Type } from 'class-transformer';
import { IsString, IsDate, IsOptional, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { CreatePOIDto } from '../dto/create-poitem.dto';

export class CreateOrderDto {
    @IsOptional()
    @IsString()
    po_number: string;

    @IsUUID()
    id_user: string;

    @Type(() => Date)
    @IsDate()
    expected_delivery_date: Date;

    @IsUUID()
    id_supplier: string;

    @IsString()
    po_status: string;
    
    @IsOptional()
    @IsString()
    note: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePOIDto)
    items: CreatePOIDto[];
}