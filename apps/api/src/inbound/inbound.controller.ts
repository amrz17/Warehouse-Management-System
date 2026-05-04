import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { InboundService } from './inbound.service';
import { CreateInboundDto } from './dto/create-inbound.dto';
import { IInboundResponse } from './types/inboundResponse.interface';
import { type AuthRequest } from '../user/types/expressRequest.interface';
import { RolesGuard } from '../user/guards/roles.guard';
import { Roles } from '../user/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';
import { AuthGuard } from '../user/guards/auth.guard';

@Controller('inbound')
@UseGuards(RolesGuard)
export class InboundController {
    constructor(
        private readonly inboundService: InboundService
    ) {}

    //
    @Get()
    @UseGuards(AuthGuard)
    @Roles( UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF_GUDANG, UserRole.PICKER)
    async getAllInbound(): Promise<IInboundResponse> {
        const inbounds = await this.inboundService.getAllInbound();

        return await this.inboundService.generatedOrderResponse(inbounds);
    }

    //
    @Post()
    @UseGuards(AuthGuard)
    @Roles( UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF_GUDANG)
    async createInbound(
        @Body() createInboundDto: CreateInboundDto,
        @Req() req: AuthRequest
    ): Promise<IInboundResponse> {
        const userId = req.user.id_user;
        const newInbound = await this.inboundService.createInbound(createInboundDto, userId);

        return await this.inboundService.generatedOrderResponse(newInbound);
    }

    // PATCH /inbound/:id/complete
    @Patch(':id/complete')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF_GUDANG)
    async completeInbound(
        @Param('id') id: string,
        @Req() req: AuthRequest
    ) {
        return this.inboundService.completeInbound(id, req.user.id_user);
    }

    //
    @Post('cancel/:id_inbound')
    @UseGuards(AuthGuard)
    @Roles( UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF_GUDANG)
    async cancelInbound(
        @Param('id_inbound', new ParseUUIDPipe()) id_inbound: string,
        @Req() req: AuthRequest
    ): Promise<IInboundResponse> {
        const userId = req.user.id_user;
        const cancel = await this.inboundService.cancelInbound(id_inbound, userId);

        return await this.inboundService.generatedOrderResponse(cancel);
    }
}
