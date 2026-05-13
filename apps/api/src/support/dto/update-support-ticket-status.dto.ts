import { IsEnum, IsNotEmpty } from "class-validator";
import { TicketStatus } from "../entities/support.entity";

export class UpdateSupportTicketStatusDto {
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status: TicketStatus;
}
