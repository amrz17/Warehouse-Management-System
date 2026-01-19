import { IsString, IsDate } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    po_number: string;

    @IsString()
    createdByIdUser: string;

    @IsDate()
    expected_delivery_date: Date;

    @IsString()
    id_supplier: string;

    @IsString()
    po_status: string;
    
    @IsString()
    note: string;
}