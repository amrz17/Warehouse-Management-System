import { IsNumber, IsString, IsUUID } from "class-validator";

export class CreateInventoryDto {
    @IsNumber()
    qty_available: number;

    @IsNumber()
    qty_reserved: number;

    @IsNumber()
    qty_ordered: number;

    @IsUUID()
    @IsString()
    id_item: string;

    @IsUUID()
    @IsString()
    id_location: string;
}