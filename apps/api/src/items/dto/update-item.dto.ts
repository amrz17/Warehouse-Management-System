import { IsBoolean, IsNumber, IsString } from "class-validator";

export class UpdateItemDto {
    @IsString()
    readonly sku: string;

    @IsString()
    readonly name: string;

    @IsString()
    readonly description: string;

    @IsNumber()
    readonly price: number;

    @IsBoolean()
    readonly isActive?: boolean;
}