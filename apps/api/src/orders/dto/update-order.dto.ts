import { IsDate, IsString } from 'class-validator';

export class UpdateOrderDto {
    @IsString()
    readonly po_number: string;

    @IsString()
    readonly createdByIdUser: string;

    @IsDate()
    readonly expected_delivery_date: Date;

    @IsString()
    readonly id_supplier: string;

    @IsString()
    readonly po_status: string;
    
    @IsString()
    readonly note: string;
}