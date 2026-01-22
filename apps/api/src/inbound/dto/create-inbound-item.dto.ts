import { IsNumber, IsUUID, Min } from "class-validator";

export class CreateInboundItemDto {
    @IsUUID()
    id_inbound: string;

    @IsUUID()
    id_item: string;

    @IsUUID()
    id_poi: string;

    @IsNumber()
    @Min(1)
    qty_received: number;
}