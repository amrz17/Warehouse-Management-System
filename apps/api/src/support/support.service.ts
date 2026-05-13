import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicketEntity } from './entities/support.entity';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportTicketEntity)
    private readonly supportTicketRepository: Repository<SupportTicketEntity>,
  ) { }

  async createTicket(userId: string, createDto: CreateSupportTicketDto) {
    const newTicket = this.supportTicketRepository.create({
      ...createDto,
      user: { id_user: userId } as any,
    });

    return await this.supportTicketRepository.save(newTicket);
  }

  async getUserTickets(userId: string) {
    return await this.supportTicketRepository.find({
      where: { user: { id_user: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async getAllTickets() {
    return await this.supportTicketRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async updateTicketStatus(id: string, status: any) {
    const ticket = await this.supportTicketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.status = status;
    return await this.supportTicketRepository.save(ticket);
  }
}
