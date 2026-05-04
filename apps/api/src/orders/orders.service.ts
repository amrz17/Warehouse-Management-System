import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity, PurchaseOrderStatus } from './entities/orders.entity';
import { DataSource, Repository } from 'typeorm';
import { IOrdersResponse } from './types/ordersResponse.interface';
import { PurchaseOrderItemsEntity } from './entities/order-items.entity';
import { InventoryEntity } from '../inventory/inventory.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ItemsEntity } from '../items/items.entity';
import { SalesOrderStatus } from 'src/sales/entities/sales-order.entity';

@Injectable()
export class OrdersService {
  constructor(
   @InjectRepository(OrderEntity) 
   private readonly orderRepository: Repository<OrderEntity>,
   private readonly activityLogsService: ActivityLogsService,
   private readonly dataSource: DataSource
) {}

  // Create Order   
   async createOrder(
      createOrderDto: CreateOrderDto,
      userId: string
   ): Promise<OrderEntity> {

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
            id_user: userId,
            supplier: { id_supplier: createOrderDto.id_supplier},
            po_status: PurchaseOrderStatus.PENDING,
            expected_delivery_date: createOrderDto.expected_delivery_date,
            note: createOrderDto.note
         } as any);
         const savePO = await queryRunner.manager.save(poHeader);
         console.log('Saved PO Header:', savePO);

         for (const itemDto of createOrderDto.items) {
            const item_number = '10';

            // Ambil data item dari database
            const item = await queryRunner.manager.findOne(ItemsEntity, {
               where: { id_item: itemDto.id_item }
            });

            if (!item) throw new Error(`Item dengan id ${itemDto.id_item} tidak ditemukan`);

            // Price dari database
            const price_per_unit = item.price;

            const poItems = queryRunner.manager.create(PurchaseOrderItemsEntity, {
               purchaseOrder: savePO,
               id_item: itemDto.id_item,
               poi_number: item_number,
               qty_ordered: itemDto.qty_ordered,
               price_per_unit: price_per_unit,         
               qty_received: 0,
               total_price: itemDto.qty_ordered * price_per_unit 
            } as any);

            await queryRunner.manager.save(poItems);

            // Update inventory
            await queryRunner.manager.increment(
               InventoryEntity,
               { id_item: itemDto.id_item },
               "qty_ordered",
               itemDto.qty_ordered,
            );
         }

         // simpan logs
         await this.activityLogsService.createLogs(queryRunner.manager, {
               id_user: userId,
               action: 'CREATE',
               module: "PURCHASE ORDER",
               resource_id: (await savePO).id_po,
               description: `${(await savePO).po_number}`,
               metadata: {
                  createdBy: (await savePO).createdBy,
                  supplier: (await savePO).supplier,
                  expected_delivery_date: (await savePO).expected_delivery_date,
                  po_status: (await savePO).po_status,
                  note: (await savePO).note,
               }
         })

         // commit 
         await queryRunner.commitTransaction()
         return savePO;

      } catch (err) {
         // rollback if error 
         await queryRunner.rollbackTransaction();
         throw new BadRequestException('Failed make new Purchase Order: ' + (err as Error).message);
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
   async cancelPurchaseOrder(
      id_po: string,
      userId: string
   ): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const po = await queryRunner.manager.findOne(OrderEntity, {
                where: { id_po: id_po },
                relations: ['items']
            });

            if (!po) throw new NotFoundException('Purchase Order Not Found!');
            if (po.po_status === PurchaseOrderStatus.CANCELED) throw new BadRequestException('Already canceled!');

            // loop items untuk mengembalikan stock
            for (const item of po.items) {

                // Kurangi stock ordered in Inventory
                await queryRunner.manager.decrement(InventoryEntity, 
                    { id_item: item.id_item },
                    "qty_ordered",
                    item.qty_ordered,
                );
            }

            // Ubah status SO
            po.po_status = PurchaseOrderStatus.CANCELED;
            await queryRunner.manager.save(po);

            // simpan logs
            await this.activityLogsService.createLogs(queryRunner.manager, {
                  id_user: userId,
                  action: 'CANCEL',
                  module: "PURCHASE ORDER",
                  resource_id: id_po,
                  description: po.po_number,
                  metadata: {
                     createdBy: po.createdBy,
                     supplier: po.supplier,
                     expected_delivery_date: po.expected_delivery_date,
                     po_status: po.po_status,
                     note: po.note,
                  }
            })

            //
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

   async getPOItems(
      id_po: string
   ): Promise<PurchaseOrderItemsEntity[]> {
      return this.dataSource.getRepository(PurchaseOrderItemsEntity).find({
         where: { id_po },
         relations: ['item']
      });
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
