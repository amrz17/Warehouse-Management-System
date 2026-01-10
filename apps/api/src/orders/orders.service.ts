import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './orders.entity';
import { Repository } from 'typeorm';
import { IOrdersResponse } from './types/ordersResponse.interface';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>) {}

  // Create Order
   async createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
      // Create a new order entity
      const newOrder = new OrderEntity();
      // Assign the DTO properties to the new order entity
      Object.assign(newOrder, createOrderDto);

      // Save the new order to the database
      return this.orderRepository.save(newOrder);
   } 

   // Get All Orders
   async getAllOrders(): Promise<OrderEntity[]> {
      return this.orderRepository.find({
         order: {
            created_at: 'DESC'
         }
      });
   }
   
   // Get Orders by User ID
   async getOrdersByUserId(id_user: string): Promise<OrderEntity[]> {
      return this.orderRepository.find({
          where: { id_user }
      });
   }


   // Update Order
   async updateOrder(id_po: string, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {

      // Find the order by id_po
      const order = await this.orderRepository.findOne({ where: { id_po } });
      
      // If order not found, throw exception
      if (!order) {
         throw new NotFoundException('Order not found');
      }

      // Update the order with the provided data
      Object.assign(order, updateOrderDto);

      // Save and return the updated order
      return this.orderRepository.save(order);
   }

   // Delete Order
   async deleteOrder(id_po: string): Promise<void> {
      await this.orderRepository.delete({ id_po });
   }

   // Helper method to generate order response
   generatedOrderResponse(order: OrderEntity | OrderEntity[]): IOrdersResponse {
      // Return the order(s) wrapped in a response object
      return {
         success: true,
         orders: order 
     };
   }

}
