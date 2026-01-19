import { IsString } from "class-validator";

export class UpdateSupplierDto {
    @IsString()
    readonly name: string;
    
    @IsString()
    readonly suppliers_address: string;

    @IsString()
    readonly pic_name: string;
}