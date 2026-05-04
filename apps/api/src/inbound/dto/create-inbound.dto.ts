import { Type } from "class-transformer";
import { IsArray, IsDate, IsString, IsUUID, ValidateNested } from "class-validator";
import { CreateInboundItemDto } from "./create-inbound-item.dto";

export class CreateInboundDto {
    @IsUUID()
    id_po: string;

    @Type(() => Date)
    @IsDate()
    received_at: Date;

    @IsString()
    note: string;
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateInboundItemDto)
    items: CreateInboundItemDto[];
}