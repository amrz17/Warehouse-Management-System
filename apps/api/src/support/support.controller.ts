import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketStatusDto } from './dto/update-support-ticket-status.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import type { AuthRequest } from '../user/types/expressRequest.interface';
import { RolesGuard } from '@app/user/guards/roles.guard';
import { Roles } from '@app/user/decorators/roles.decorator';
import { UserRole } from '@app/user/user.entity';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) { }

  @Post()
  @UseGuards(AuthGuard)
  async createTicket(
    @Body() createDto: CreateSupportTicketDto,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user.id_user;
    const ticket = await this.supportService.createTicket(userId, createDto);
    return { supportTicket: ticket };
  }

  @Get()
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getTickets(@Req() req: AuthRequest) {
    const userId = req.user.id_user;
    const role = req.user.role;

    if (role === 'ADMIN') {
      const tickets = await this.supportService.getAllTickets();
      return { supportTickets: tickets };
    }

    const tickets = await this.supportService.getUserTickets(userId);
    return { supportTickets: tickets };
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateSupportTicketStatusDto,
  ) {
    const ticket = await this.supportService.updateTicketStatus(id, updateDto.status);
    return { supportTicket: ticket };
  }
}
