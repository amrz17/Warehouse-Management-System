import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDTO } from './dto/create-sale.dto';
import { ISaleResponse } from './types/salesResponse.interface';

@Controller('sale')
export class SalesController {
    constructor(private readonly saleOrderService: SalesService) {}

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

