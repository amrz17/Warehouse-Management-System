import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InboundEntity } from './entities/inbound.entity';
import { Repository } from 'typeorm';
import { CreateInboundDto } from './dto/create-inbound.dto';
import { UpdateInboundDto } from './dto/update-inbound.dto';

@Injectable()
export class InboundService {
    constructor(
        @InjectRepository(InboundEntity)
        private readonly inboundRepo: Repository<InboundEntity>
    ) {}

    // create 
    async createInbound(
        createInboundDto: CreateInboundDto
    ): Promise<any> {
        // TODO Make Logic business

        
    }

    async updateInbound(
        updateInboundDto: UpdateInboundDto
    ): Promise<any> {
        // TODO Make Logic update
    }
}
