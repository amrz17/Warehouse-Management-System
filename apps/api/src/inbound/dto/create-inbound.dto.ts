import { Type } from "class-transformer";
import { IsArray, IsDate, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateInboundItemDto } from "./create-inbound-item.dto";

export class CreateInboundDto {
    @IsString()
    inbound_number: string;

    @IsUUID()
    id_po: string;

    @IsUUID()
    id_user: string;

    @Type(() => Date)
    @IsDate()
    received_at: Date;

    @IsUUID()
    id_supplier: string;

    @IsString()
    note: string;
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateInboundItemDto)
    items: CreateInboundItemDto[];
}