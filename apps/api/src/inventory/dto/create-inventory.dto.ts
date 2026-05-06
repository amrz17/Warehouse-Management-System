import { IsNumber, IsString, IsUUID } from "class-validator";

export class CreateInventoryDto {
    @IsUUID()
    @IsString()
    id_item: string;

    @IsUUID()
    @IsString()
    id_location: string;

    @IsNumber()
    qty_available: number;
}