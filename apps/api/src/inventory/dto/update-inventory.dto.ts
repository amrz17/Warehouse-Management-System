import { IsNumber, IsString, IsUUID } from "class-validator";

export class UpdateInventoryDto {
    @IsNumber()
    readonly qty_available: number;

    @IsNumber()
    readonly qty_reserved: number;

    @IsNumber()
    readonly qty_ordered: number;

    @IsUUID()
    @IsString()
    readonly id_item: string;

    @IsUUID()
    @IsString()
    readonly id_location: string;
}