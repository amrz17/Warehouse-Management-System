import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsUUID, Min, ValidateNested } from "class-validator";
import { UpdateInboundItemDto } from "./update-inbound-item.dto";

export class UpdateInboundDto {
    @IsOptional()
    @IsUUID()
    readonly id_inbound: string;

    @IsOptional()
    @IsUUID()
    readonly id_item: string;

    @IsOptional()
    @IsUUID()
    readonly id_poi: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    readonly qty_received: number;

    // update po item 
    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => UpdateInboundItemDto)
    readonly items?: UpdateInboundItemDto[];
}