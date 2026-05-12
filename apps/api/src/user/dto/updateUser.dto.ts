import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    readonly name?: string;

    @IsOptional()
    @IsString()
    readonly username?: string;

    @IsOptional()
    @IsString()
    readonly email?: string;

    @IsOptional()
    @IsString()
    readonly password?: string;

    @IsOptional()
    @IsString()
    readonly role?: string;
}