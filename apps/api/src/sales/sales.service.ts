import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SalesOrderEntity, SalesOrderStatus } from './entities/sales-order.entity';
import { CreateSaleDTO } from './dto/create-sale.dto';
import { SaleOrderItemsEntity } from './entities/sale-order-items.entity';
import { ISaleResponse } from './types/salesResponse.interface';
import { InventoryEntity } from '../inventory/inventory.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ItemsEntity } from '../items/items.entity';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(SalesOrderEntity)
        private readonly saleRepo: Repository<SalesOrderEntity>,
        private readonly activityLogsService: ActivityLogsService,
        private readonly dataSource: DataSource
    ) {}

    // Get All Sale Orders
    async getAllSaleOrders(): Promise<SalesOrderEntity[]> {
        return this.saleRepo.find({ 
            relations: [
                'customer', 
                'createdBy', 
                'items.item'
            ],
            order: { created_at: 'DESC' }
         });
    }

    // Create Sale Order
    async createSaleOrder(
        createSaleDTO: CreateSaleDTO,
        userId: string
    ): Promise<any> {

        const queryRunner = this.dataSource.createQueryRunner();
        // connect to db
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Generate Nomor SO
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const soNumber = `SO-${dateStr}-${Math.floor(1000 + Math.random() * 9000 )}`;

            // save header
            const soHeader = queryRunner.manager.create(SalesOrderEntity, {
                so_number: soNumber,
                so_status: SalesOrderStatus.PENDING,
                date_shipped: createSaleDTO.date_shipped,
                customer: { id_customer: createSaleDTO.id_customer},
                id_user: userId,
                note: createSaleDTO.note
            } as any);

            const saveSO = await queryRunner.manager.save(soHeader);


            // loop untuk save detail dan update inventory
            for (const itemDto of createSaleDTO.items) {

                const item_number = '10';

                // Ambil data item dari database
                const item = await queryRunner.manager.findOne(ItemsEntity, {
                where: { id_item: itemDto.id_item }
                });

                if (!item) throw new Error(`Item dengan id ${itemDto.id_item} tidak ditemukan`);

                // Price dari database
                const price_per_unit = item.price;

                // simpan 
                const soItems = queryRunner.manager.create(SaleOrderItemsEntity, {
                    sales_order : saveSO,
                    id_item : itemDto.id_item,
                    soi_number :item_number, 
                    qty_ordered : itemDto.qty_ordered,
                    price_per_unit : price_per_unit, 
                    qty_shipped : itemDto.qty_shipped,

                    // Auto logic
                    total_price : itemDto.qty_ordered * price_per_unit
                })
                await queryRunner.manager.save(soItems);

                // id so
                const soiId = itemDto.id_item;

                const reservedItem = await queryRunner.manager.findOne  (InventoryEntity, {
                    where: { id_item: soiId }
                })

                if (!reservedItem || Number(reservedItem.qty_reserved) < Number(itemDto.qty_shipped)) {
                    throw new BadRequestException(`Stok reserved tidak mencukupi untuk item ${itemDto.id_item}!`);
                }

                await queryRunner.manager.decrement(InventoryEntity, 
                    { id_inventory: reservedItem.id_inventory },
                    "qty_available",
                    itemDto.qty_ordered
                );

                await queryRunner.manager.increment(InventoryEntity, 
                    { id_inventory: reservedItem.id_inventory },
                    "qty_reserved",
                    itemDto.qty_ordered
                );
            }

            // simpan logs
            await this.activityLogsService.createLogs(queryRunner.manager, {
                id_user: userId,
                action: 'CREATE',
                module: "SALE ORDER",
                resource_id: (await saveSO).id_so,
                description: `${(await saveSO).so_number}`,
                metadata: {
                    createdBy: (await saveSO).createdBy,
                    customer: (await saveSO).customer.full_name,
                    date_shipped: (await saveSO).date_shipped,
                    so_status: (await saveSO).so_status,
                    note: (await saveSO).note,
                }
            })

            // commit 
            await queryRunner.commitTransaction();
            return saveSO;

        } catch (err) {
            // rollback
            await queryRunner.rollbackTransaction();
            throw new BadRequestException('Failed make new Sale Order: ' + (err as Error).message);
        } finally {
            // disconnect db
            await queryRunner.release();
        }
    }

    async cancelSaleOrder(
        id_so: string,
        userId: string
    ): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const so = await queryRunner.manager.findOne(SalesOrderEntity, {
                where: { id_so },
                relations: ['items']
            });

            if (!so) throw new NotFoundException('Sale Order Not Found!');
            if (so.so_status === SalesOrderStatus.CANCELED) throw new BadRequestException('Already canceled!');

            // loop items untuk mengembalikan stock
            for (const item of so.items) {

                // Kurangi stock reserved in Inventory
                await queryRunner.manager.decrement(InventoryEntity, 
                    { id_item: item.id_item },
                    "qty_reserved",
                    item.qty_ordered,
                );
            }

            // Ubah status SO
            so.so_status = SalesOrderStatus.CANCELED;
            await queryRunner.manager.save(so);

            // simpan logs
            await this.activityLogsService.createLogs(queryRunner.manager, {
                id_user: userId,
                action: 'CANCEL',
                module: "SALE ORDER",
                resource_id: so.id_so,
                description: so.so_number,
                metadata: {
                    createdBy: so.createdBy,
                    customer: so.id_customer,
                    date_shipped: so.date_shipped,
                    so_status: so.so_status,
                    note: so.note,
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

    async approveSO(
        id_so: string,
        userId: string
    ): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const so = await this.saleRepo.findOne({ where: { id_so } });

            if (!so) throw new NotFoundException('Sale Order tidak ditemukan');

            if (so.so_status !== SalesOrderStatus.PENDING) {
                throw new BadRequestException('Hanya SO dengan status PENDING yang bisa di APPROVED');
            }

            // simpan logs
            await this.activityLogsService.createLogs(queryRunner.manager, {
                id_user: userId,
                action: "UPDATE",
                module: "SALE ORDER",
                resource_id: so.id_so,
                description: so.so_number,
                metadata: {
                    createdBy: so.createdBy,
                    customer: so.id_customer,
                    date_shipped: so.date_shipped,
                    so_status: so.so_status,
                    note: so.note,
                }
            })

            await this.saleRepo.update({ id_so }, { so_status: SalesOrderStatus.APPROVED });
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async completeSO(id_so: string, userId: string): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const so = await this.saleRepo.findOne({ where: { id_so } });

            if (!so) throw new NotFoundException('Sale Order tidak ditemukan');

            if (so.so_status !== SalesOrderStatus.SHIPPED) {
                throw new BadRequestException('Hanya SO dengan status SHIPPED yang bisa COMPLETED');
            }

            // simpan logs
            await this.activityLogsService.createLogs(queryRunner.manager, {
                id_user: userId,
                action: "UPDATE",
                module: "SALE ORDER",
                resource_id: so.id_so,
                description: so.so_number,
                metadata: {
                    createdBy: so.createdBy,
                    customer: so.id_customer,
                    date_shipped: so.date_shipped,
                    so_status: so.so_status,
                    note: so.note,
                }
            })

            await this.saleRepo.update({ id_so }, { so_status: SalesOrderStatus.COMPLETED });
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

   async getSOItems(
      id_so: string
   ): Promise<SaleOrderItemsEntity[]> {
      return this.dataSource.getRepository(SaleOrderItemsEntity).find({
         where: { id_so },
         relations: ['item']
      });
   }

    // 
    generateSaleOrderResponse(
        sale: SalesOrderEntity | SalesOrderEntity[]
    ): ISaleResponse {
        return {
            success: true,
            sales: sale
        }
    }

}
