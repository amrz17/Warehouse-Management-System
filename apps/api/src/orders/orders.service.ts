import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity, PurchaseOrderStatus } from './entities/orders.entity';
import { DataSource, Repository } from 'typeorm';
import { IOrdersResponse } from './types/ordersResponse.interface';
import { PurchaseOrderItemsEntity } from './entities/order-items.entity';
import { InventoryEntity } from 'src/inventory/inventory.entity';

@Injectable()
export class OrdersService {
  constructor(
   @InjectRepository(OrderEntity) 
   private readonly orderRepository: Repository<OrderEntity>,
   private readonly dataSource: DataSource
) {}

  // Create Order   
   async createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {

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
         } as any);
         const savePO = await queryRunner.manager.save(poHeader);

         // Simpan items po dan update inventory
         for (const itemDto of createOrderDto.items) {

            // simpan 
            const poItems = queryRunner.manager.create(PurchaseOrderItemsEntity, {
                purchaseOrder : savePO,
                id_item : itemDto.id_item,
                qty_ordered : itemDto.qty_ordered,
                price_per_unit : itemDto.price_per_unit,

                // Auto logic
                qty_received : 0,
                total_price : itemDto.qty_ordered * itemDto.price_per_unit
            } as any);
            await queryRunner.manager.save(poItems);

            const poId = itemDto.id_item;

            // Update inventory - tambah qty_ordered di inventory
            await queryRunner.manager.increment(InventoryEntity, 
               { id_item: poId },
               "qty_ordered",
               itemDto.qty_ordered,
            );
         }

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
         relations: ['createdBy', 'supplier', 'items.item'],
         order: {
            created_at: 'DESC'
         }
      });
   }

   // Cancel Purchase Order
   async cancelPurchaseOrder(id_po: string): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const so = await queryRunner.manager.findOne(OrderEntity, {
                where: { id_po: id_po },
                relations: ['items']
            });

            if (!so) throw new NotFoundException('Purchase Order Not Found!');
            if (so.po_status === PurchaseOrderStatus.CANCELED) throw new BadRequestException('Already canceled!');

            // loop items untuk mengembalikan stock
            for (const item of so.items) {

                // Kurangi stock ordered in Inventory
                await queryRunner.manager.decrement(InventoryEntity, 
                    { id_item: item.id_item },
                    "qty_ordered",
                    item.qty_ordered,
                );
            }

            // Ubah status SO
            so.po_status = PurchaseOrderStatus.CANCELED;
            await queryRunner.manager.save(so);

            //
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw err;
        } finally {
            await queryRunner.release();
        }
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
