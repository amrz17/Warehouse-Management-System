import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateInventoryDto {
    @IsUUID()
    @IsString()
    readonly id_item: string;

    @IsUUID()
    @IsString()
    readonly id_location: string;

    @IsNumber()
    readonly qty_available: number;

    @IsNumber()
    readonly qty_reserved: number;

    @IsNumber()
    readonly qty_ordered: number;

    @IsNumber()
    @IsOptional()
    readonly min_stock?: number;

    @IsNumber()
    @IsOptional()
    readonly max_stock?: number;
}