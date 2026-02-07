import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { IOrdersResponse } from './types/ordersResponse.interface';

@Controller('purchase-order')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    // Create Order
    @Post('')
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<IOrdersResponse> {
        const saveOrder = await this.ordersService.createOrder(createOrderDto);

        return this.ordersService.generatedOrderResponse(saveOrder);
    }

    // Get All Orders
    @Get('')
    async getAllOrders(): Promise<IOrdersResponse> {
        const orders = await this.ordersService.getAllOrders();

        return this.ordersService.generatedOrderResponse(orders);
    }

    // Cancel Purchase Order
    @Post('/cancel/:id_po')
    async cancelPurchaseOrder(
        @Param('id_po', new ParseUUIDPipe()) id_po: string,
    ): Promise<any> {
        const po = await this.ordersService.cancelPurchaseOrder(id_po);

        return await this.ordersService.generatedOrderResponse(po);
    }

    // // Get Orders by User ID
    // @Get(':id_user')
    // async getOrdersByUserId(@Param('id_user', new ParseUUIDPipe()) id_user: string): Promise<IOrdersResponse> {
    //     const order = await this.ordersService.getOrdersByUserId(id_user);

    //     return this.ordersService.generatedOrderResponse(order);
    // }

}
