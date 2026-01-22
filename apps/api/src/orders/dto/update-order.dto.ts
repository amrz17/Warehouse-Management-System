import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UpdatePOIDto } from './update-poitem.dto';

export class UpdateOrderDto {
    @IsOptional()
    @IsUUID()
    readonly id_user: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    readonly expected_delivery_date: Date;

    @IsOptional()
    @IsUUID()
    readonly id_supplier: string;

    @IsOptional()
    @IsString()
    readonly po_status: string;
    
    @IsOptional()
    @IsString()
    readonly note: string;

    // update po item 
    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => UpdatePOIDto)
    readonly items?: UpdatePOIDto[];
}