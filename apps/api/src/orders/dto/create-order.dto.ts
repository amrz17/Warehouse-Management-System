import { IsString, IsDate, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsUUID()
    id_user: string;

    @IsString()
    po_code: string;

    @IsDate()
    date_po: Date;

    @IsString()
    po_status: string;
    
    @IsString()
    note: string;
}