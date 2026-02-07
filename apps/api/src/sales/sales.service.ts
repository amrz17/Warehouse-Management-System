import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SalesOrderEntity, SalesOrderStatus } from './entities/sales-order.entity';
import { CreateSaleDTO } from './dto/create-sale.dto';
import { SaleOrderItemsEntity } from './entities/sale-order-items.entity';
import { ISaleResponse } from './types/salesResponse.interface';
import { InventoryEntity } from 'src/inventory/inventory.entity';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(SalesOrderEntity)
        private readonly saleRepo: Repository<SalesOrderEntity>,
        private readonly dataSource: DataSource
    ) {}

    // Get All Sale Orders
    async getAllSaleOrders(): Promise<SalesOrderEntity[]> {
        return this.saleRepo.find({ 
            relations: [
                'customer', 
                'createdBy', 
                'items'
            ] });
    }

    // Create Sale Order
    async createSaleOrder(
        createSaleDTO: CreateSaleDTO
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
                so_status: createSaleDTO.so_status,
                date_shipped: createSaleDTO.date_shipped,
                customer: { id_customer: createSaleDTO.id_customer},
                createdBy: { id_user: createSaleDTO.id_user },
                note: createSaleDTO.note
            } as any);

            const saveSO = await queryRunner.manager.save(soHeader);


            // loop untuk save detail dan update inventory
            for (const itemDto of createSaleDTO.items) {

                // simpan 
                const soItems = queryRunner.manager.create(SaleOrderItemsEntity, {
                    sales_order : saveSO,
                    id_item : itemDto.id_item,
                    qty_ordered : itemDto.qty_ordered,
                    price_per_unit : itemDto.price_per_unit, 
                    qty_shipped : itemDto.qty_shipped,

                    // Auto logic
                    total_price : itemDto.qty_ordered * itemDto.price_per_unit
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

            // commit 
            await queryRunner.commitTransaction();
            return saveSO;

        } catch (err) {
            // rollback
            await queryRunner.rollbackTransaction();
            throw new BadRequestException('Failed make new Sale Order: ' + err.message);
        } finally {
            // disconnect db
            await queryRunner.release();
        }
    }

    async cancelSaleOrder(id_so: string): Promise<any> {
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

            //
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw err;
        } finally {
            await queryRunner.release();
        }
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
