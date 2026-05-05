import { Type } from "class-transformer";
import { IsArray, IsDate, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateSaleItemDto } from "./create-saleItem.dto";

export class CreateSaleDTO {
    @IsOptional()
    @IsString()
    so_number: string;
    
    @Type(() => Date)
    @IsDate()
    date_shipped: Date;

    @IsUUID()
    id_customer: string;

    @IsOptional()
    @IsString()
    note: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSaleItemDto)
    items: CreateSaleItemDto[];
}