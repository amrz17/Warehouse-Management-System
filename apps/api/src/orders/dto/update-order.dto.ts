import { IsString } from 'class-validator';

export class UpdateOrderDto {
    @IsString()
    readonly id_user?: string;
    @IsString()
    readonly po_code?: string;
    @IsString()
    readonly date_po?: Date;
    @IsString()
    readonly po_status?: string;
    @IsString()
    readonly note?: string;
}