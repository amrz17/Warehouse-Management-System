import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { OutboundService } from './outbound.service';
import { CreateOutbounddDto } from './dto/create-outbound.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { type AuthRequest } from '../user/types/expressRequest.interface';
import { Roles } from '../user/decorators/roles.decorator';
import { RolesGuard } from '../user/guards/roles.guard';
import { UserRole } from '../user/user.entity';
import { ShipOutboundDto } from './dto/ship-outbound.dto';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF_GUDANG)
@Controller('outbound')
export class OutboundController {
    constructor(
        private readonly outboundService: OutboundService
    ) {}

    // 
    @Post()
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF_GUDANG)
    async createOutbound(
        @Body() createOuboundDto: CreateOutbounddDto,
        @Req() req: AuthRequest
    ): Promise<any> {
        const userId = req.user.id_user;
        const newOutbound = await this.outboundService.createOutbound(createOuboundDto, userId);

        return await this.outboundService.generatedResponse(newOutbound);
    }

    // 
    @Patch(':id/ship')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async shipOutbound(
        @Param('id') id: string,
        @Body() dto: ShipOutboundDto,
        @Req() req: AuthRequest
    ) {
        return this.outboundService.shipOutbound(id, dto, req.user.id_user);
    }

    //
    @Post('cancel/:id_outbound')
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF_GUDANG)
    async cancelOutbound(
        @Param('id_outbound', new ParseUUIDPipe()) id_outbound: string,
        @Req() req: AuthRequest
    ): Promise<any> {
        const userId = req.user.id_user;
        const cancel = await this.outboundService.cancelOutbound(id_outbound, userId);

        return await this.outboundService.generatedResponse(cancel);
    }

    //
    @Patch(':id/complete')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async completeOutbound(
        @Param('id') id: string,
        @Req() req: AuthRequest
    ) {
        return this.outboundService.completeOutbound(id, req.user.id_user);
    }

    //
    @Get()
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF_GUDANG)
    async getAllOutbound(): Promise<any> {
        const outbounds = await this.outboundService.getAllOutbound();

        return await this.outboundService.generatedResponse(outbounds);
    }

}
