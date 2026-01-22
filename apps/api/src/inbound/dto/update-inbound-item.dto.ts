import { IsNumber, IsUUID, Min } from "class-validator";

export class UpdateInboundItemDto {
    @IsUUID()
    readonly id_inbound: string;

    @IsUUID()
    readonly id_item: string;

    @IsUUID()
    readonly id_poi: string;

    @IsNumber()
    @Min(1)
    readonly qty_received: number;
}