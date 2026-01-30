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

                const reservedItem = await queryRunner.manager.find(InventoryEntity, {
                    where: { id_item: soiId }
                })

                if (reservedItem) {
                    // Update Inventory berdasarkan id item
                    let inventory = await queryRunner.manager.findOne(InventoryEntity, {
                        where: { 
                            id_item: itemDto.id_item, 
                        }
                    });

                    if (inventory) {
                        // Update qty reserved 
                        inventory.qty_reserved = Number(inventory.qty_reserved) + Number(itemDto.qty_ordered);
                    } else {
                        // Buat baris baru jika barang belum pernah ada di lokasi tersebut
                        inventory = queryRunner.manager.create(InventoryEntity, {
                            id_item: itemDto.id_item,
                            qty_available: Number(itemDto.qty_ordered),
                        });
                    }
                    await queryRunner.manager.save(inventory);
                }
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
            // TODO Make Update and Cancel Sale Order
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
