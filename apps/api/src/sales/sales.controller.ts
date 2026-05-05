import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDTO } from './dto/create-sale.dto';
import { ISaleResponse } from './types/salesResponse.interface';
import { AuthGuard } from '../user/guards/auth.guard';
import { type AuthRequest } from '../user/types/expressRequest.interface';
import { Roles } from '../user/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';

@Controller('sale-order')
export class SalesController {
    constructor(private readonly saleOrderService: SalesService) {}

    // Get All Sale Orders
    @Get()
    async getAllSaleOrders(): Promise<ISaleResponse> {
        const allSales = await this.saleOrderService.getAllSaleOrders();
        return this.saleOrderService.generateSaleOrderResponse(allSales);
    }

    // 
    @Post()
    @UseGuards(AuthGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF_GUDANG)
    async createSale(
        @Body() createSaleOrderDto: CreateSaleDTO,
        @Req() req: AuthRequest
    ): Promise<ISaleResponse> {
        const userId = req.user.id_user;
        const newSale = await this.saleOrderService.createSaleOrder(createSaleOrderDto, userId);

        return await this.saleOrderService.generateSaleOrderResponse(newSale);
    }

    @Post('/approve/:id_so')
    @UseGuards(AuthGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async approveSO(
        @Param('id_so', new ParseUUIDPipe()) id_so: string,
        @Req() req: AuthRequest
    ): Promise<ISaleResponse> {
        const userId = req.user.id_user;
        const so = await this.saleOrderService.approveSO(id_so, userId);
        return await this.saleOrderService.generateSaleOrderResponse(so);
    }

    @Post('/complete/:id_so')
    @UseGuards(AuthGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF_GUDANG)
    async completeSO(
        @Param('id_so', new ParseUUIDPipe()) id_so: string,
        @Req() req: AuthRequest
    ): Promise<ISaleResponse> {
        const userId = req.user.id_user;
        const so = await this.saleOrderService.completeSO(id_so, userId);
        return await this.saleOrderService.generateSaleOrderResponse(so);
    }

    @Post('/cancel/:id_so')
    @UseGuards(AuthGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF_GUDANG)
    async cancelSaleOrder(
        @Param('id_so', new ParseUUIDPipe()) id_so: string,
        @Req() req: AuthRequest
    ): Promise<any> {
        const userId = req.user.id_user;
        const so = await this.saleOrderService.cancelSaleOrder(id_so, userId);

        return await this.saleOrderService.generateSaleOrderResponse(so);
    }
    
    @Get(':id/items')
    // @UseGuards(AuthGuard)
    // @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF_GUDANG)
    async getSOItems(@Param('id') id: string) {
        return this.saleOrderService.getSOItems(id);
    }

}

