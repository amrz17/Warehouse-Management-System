import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { IOrdersResponse } from './types/ordersResponse.interface';

@Controller('order')
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

    // Get Orders by User ID
    @Get(':id_user')
    async getOrdersByUserId(@Param('id_user', new ParseUUIDPipe()) id_user: string): Promise<IOrdersResponse> {
        const order = await this.ordersService.getOrdersByUserId(id_user);

        return this.ordersService.generatedOrderResponse(order);
    }

    // Update Order
    @Put('update/:id_po')
    async updateOrder(
        @Param('id_po', new ParseUUIDPipe()) id_po: string,
        @Body() updateOrderDto: CreateOrderDto
    ): Promise<IOrdersResponse> {
        const updatedOrder = await this.ordersService.updateOrder(id_po, updateOrderDto);

        return this.ordersService.generatedOrderResponse(updatedOrder);
    }

    // Delete Order
    @Delete('delete/:id_po')
    async deleteOrder(
        @Param('id_po', new ParseUUIDPipe()) id_po: string
    ): Promise<void> {
        return this.ordersService.deleteOrder(id_po);
    }
}
