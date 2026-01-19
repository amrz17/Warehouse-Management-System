import { IsString } from "class-validator";

export class CreateSupplierDto {
    @IsString()
    name: string;
    
    @IsString()
    suppliers_address: string;

    @IsString()
    pic_name: string;
}