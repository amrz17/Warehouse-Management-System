import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDTO } from './dto/create-sale.dto';
import { ISaleResponse } from './types/salesResponse.interface';

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
    async createSale(
        @Body() createSaleOrderDto: CreateSaleDTO 
    ): Promise<ISaleResponse> {
        const newSale = await this.saleOrderService.createSaleOrder(createSaleOrderDto);

        return await this.saleOrderService.generateSaleOrderResponse(newSale);
    }

    @Post('/cancel/:id_so')
    async cancelSaleOrder(
        @Param('id_so', new ParseUUIDPipe()) id_so: string,
    ): Promise<any> {
        const so = await this.saleOrderService.cancelSaleOrder(id_so);

        return await this.saleOrderService.generateSaleOrderResponse(so);
    }

}

