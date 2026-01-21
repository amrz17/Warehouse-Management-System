import { IsNumber, IsUUID, Min } from "class-validator";

export class CreatePOIDto {
    @IsUUID()
    id_item: string;

    @IsNumber()
    @Min(1)
    qty_ordered: number;

    @IsNumber()
    @Min(0)
    price_per_unit: number;
}