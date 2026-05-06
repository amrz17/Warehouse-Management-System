import { IsString, IsOptional } from 'class-validator';

export class ShipOutboundDto {
    @IsString()
    carrier_name: string;

    @IsString()
    tracking_number: string;

    @IsString()
    @IsOptional()
    note?: string;
}