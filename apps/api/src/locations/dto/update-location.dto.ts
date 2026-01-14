import { IsString } from "class-validator";

export class UpdateLocationDto {
    @IsString()
    readonly bin_code: string;

    @IsString()
    readonly description: string;
}