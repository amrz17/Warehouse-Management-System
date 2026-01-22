import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity, PurchaseOrderStatus } from './entities/orders.entity';
import { DataSource, Repository } from 'typeorm';
import { IOrdersResponse } from './types/ordersResponse.interface';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PurchaseOrderItemsEntity } from './entities/order-items.entity';

@Injectable()
export class OrdersService {
  constructor(
   @InjectRepository(OrderEntity) 
   private readonly orderRepository: Repository<OrderEntity>,
   private readonly dataSource: DataSource
) {}

  // Create Order   
   async createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
      // // Create a new order entity
      // const newOrder = new OrderEntity();
      // // Assign the DTO properties to the new order entity
      // Object.assign(newOrder, createOrderDto);

      // // Save the new order to the database
      // return this.orderRepository.save(newOrder);

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
         // Generate Nomor PO
         const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
         const poNumber = `PO-${dateStr}-${Math.floor(1000 + Math.random() * 9000 )}`;

         // Simpan header po
         const poHeader = queryRunner.manager.create(OrderEntity, {
            po_number : poNumber,
            createdBy: { id_user: createOrderDto.id_user },
            supplier: { id_supplier: createOrderDto.id_supplier},
            status: PurchaseOrderStatus.PENDING,
            expected_delivery_date: createOrderDto.expected_delivery_date,
            note: createOrderDto.note
         });
         const savePO = await queryRunner.manager.save(poHeader);


         // Simpan Detail ke PO Item
         // const poItems = createOrderDto.items.map((item) => {
         //    return queryRunner.manager.create(PurchaseOrderItemsEntity, {
         //       purchaseOrder: savePO,
         //       item: { id_item: item.id_item },
         //       qty_ordered: item.qty_ordered,
         //       price_per_unit: item.price_per_unit,
         //    });
         // });

         const poItems = createOrderDto.items.map((itemDto) => {
            const item = new PurchaseOrderItemsEntity();
            item.purchaseOrder = savePO;
            item.id_item = itemDto.id_item;
            item.qty_ordered = itemDto.qty_ordered;
            item.price_per_unit = itemDto.price_per_unit;

            // Auto logic
            item.qty_received = 0;
            item.total_price = itemDto.qty_ordered * itemDto.price_per_unit;

            return item;
         })
         await queryRunner.manager.save(poItems);

         // commit 
         await queryRunner.commitTransaction()
         return savePO;

      } catch (err) {
         // rollback if error 
         await queryRunner.rollbackTransaction();
         throw new BadRequestException('Failed make new Purchase Order: ' + err.message);
      } finally {
         // Disconnect queryRunner
         await queryRunner.release();
      }
   } 

   // Get All Orders
   async getAllOrders(): Promise<OrderEntity[]> {
      return this.orderRepository.find({
         order: {
            created_at: 'DESC'
         }
      });
   }
   
   // // Get Orders by User ID
   // async getOrdersByUserId(id_user: string): Promise<OrderEntity[]> {
   //    return this.orderRepository.find({
   //        where: { id_user }
   //    });
   // }


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
