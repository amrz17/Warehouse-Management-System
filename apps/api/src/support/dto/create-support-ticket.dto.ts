import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { TicketPriority } from "../entities/support.entity";

export class CreateSupportTicketDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TicketPriority)
  @IsNotEmpty()
  priority: TicketPriority;
}
