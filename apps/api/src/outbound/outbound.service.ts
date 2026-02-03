import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OutboundEntity, StatusOutbound } from './entities/outbound.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateOutbounddDto } from './dto/create-outbound.dto';
import { OutboundItemEntity } from './entities/outbound-item.entity';
import { SaleOrderItemsEntity } from 'src/sales/entities/sale-order-items.entity';
import { SalesOrderEntity, SalesOrderStatus } from 'src/sales/entities/sales-order.entity';
import { InventoryEntity } from 'src/inventory/inventory.entity';
import { IOutboundResponse } from './types/outboundResponse.Interface';

@Injectable()
export class OutboundService {
    constructor(
        @InjectRepository(OutboundEntity)
        private readonly outboundRepo: Repository<OutboundEntity>,
        private readonly dataSource: DataSource
    ) {}

    async createOutbound(
        createOutboundDto: CreateOutbounddDto
    ): Promise<any> {
        const queryRunner = await this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            const outboundHeader = await queryRunner.manager.create(OutboundEntity, {
                outbound_number: createOutboundDto.outbound_number,
                sales_order: { id_so: createOutboundDto.id_so },
                shipped_by: { id_user: createOutboundDto.id_user },
                customer: { id_customer: createOutboundDto.id_customer },
                shipped_at: createOutboundDto.shipped_at,
                carrier_name: createOutboundDto.carrier_name,
                tracking_number: createOutboundDto.tracking_number,
                status_outbound: createOutboundDto.status_inbound,
                note: createOutboundDto.note
            })

            const saveOutbound = await queryRunner.manager.save(outboundHeader);

            for (const itemDto of createOutboundDto.items) {
                // 
                const outboundItem = queryRunner.manager.create(OutboundItemEntity, {
                  outbound: saveOutbound,
                  id_item: itemDto.id_item,
                  id_soi: itemDto.id_soi,
                  qty_shipped: Number(itemDto.qty_shipped),
                })
                await queryRunner.manager.save(outboundItem);


                // 
                const inventory = await queryRunner.manager.findOne(InventoryEntity, {
                    where: {
                        id_item: itemDto.id_item
                    }
                })

                if (!inventory || Number(inventory.qty_reserved) < Number(itemDto.qty_shipped)) {
                    throw new BadRequestException(`Stok di lokasi tersebut tidak mencukupi atau tidak ditemukan!`);
                }

                //
                await queryRunner.manager.increment(SaleOrderItemsEntity, 
                    { id_soi: itemDto.id_soi },
                    "qty_shipped",
                    itemDto.qty_shipped
                );

                await queryRunner.manager.decrement(InventoryEntity, 
                    { id_inventory: inventory.id_inventory },
                    "qty_reserved",
                    itemDto.qty_shipped
                );

                //
                const soiId = itemDto.id_soi;

                const soItem = await queryRunner.manager.findOne(SaleOrderItemsEntity, {
                    where: { id_soi: soiId},
                    relations: ['sales_order']
                });

                if (soItem && soItem.id_so) {
                    const soId = soItem.sales_order.id_so;

                    //
                    const allSoItems = await queryRunner.manager.find(SaleOrderItemsEntity, {
                        where: { id_so: soId }
                    });

                    // 
                    const isFullyShipped = allSoItems.every(item => 
                        Number(item.qty_shipped) >= Number(item.qty_ordered)
                    );

                    //
                    await queryRunner.manager.update(SalesOrderEntity, 
                        { id_so: soId },
                        { so_status: isFullyShipped ? SalesOrderStatus.COMPLETED : SalesOrderStatus.SHIPPED }

                    );
                }
            }

            // 
            await queryRunner.commitTransaction();
            return saveOutbound;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException('Failed make new Outbound: ', error.message); 
        } finally {
            await queryRunner.release();
        }
    }

    async cancelOutbound(
        id_outbound: string
    ): Promise<any> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Ambil data Outbound beserta detailnya
            const outbound = await queryRunner.manager.findOne(OutboundEntity, {
                where: { id_outbound },
                relations: ['items'] 
            });

            if (!outbound) throw new NotFoundException('Outbound not found');
            if (outbound.status_outbound === StatusOutbound.CANCELED) throw new BadRequestException('Already cancelled');

            // Loop Items untuk Mengembalikan Stok
            for (const item of outbound.items) {
                
                // Kurangi stok di Inventory
                await queryRunner.manager.decrement(InventoryEntity,
                    { id_item: item.id_item },
                    "qty_available",
                    item.qty_shipped
                );

                // Kurangi qty_shipped di Sales Order Item
                await queryRunner.manager.decrement(SaleOrderItemsEntity,
                    { id_soi: item.id_soi },
                    "qty_shipped",
                    item.qty_shipped
                );
            }

            // Ubah status Outbound Header
            outbound.status_outbound = StatusOutbound.CANCELED;
            await queryRunner.manager.save(outbound);

            // Update kembali status PO Header ke 'PARTIAL' atau 'OPEN'
            await this.updateSoStatus(outbound.id_so, queryRunner);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    // 
    private async updateSoStatus(id_so: string, queryRunner: QueryRunner): Promise<void> {
        // Ambil semua item dari SO tersebut
        const allSoItems = await queryRunner.manager.find(SaleOrderItemsEntity, {
            where: { id_so: id_so }
        });

        // Hitung status berdasarkan qty
        let totalOrdered = 0;
        let totalShipped = 0;

        allSoItems.forEach(item => {
            totalOrdered += Number(item.qty_ordered);
            totalShipped += Number(item.qty_shipped);
        });

        let newStatus = 'OPEN';
        if (totalShipped >= totalOrdered) {
            newStatus = 'COMPLETED';
        } else if (totalShipped > 0) {
            newStatus = 'SHIPPED';
        }

        // Update status ke tabel SO Header
        await queryRunner.manager.update(SalesOrderEntity, 
            { id_so: id_so }, 
            { so_status: newStatus as any }
        );
    }




   // function to generate order response
   generatedResponse(outbound: OutboundEntity | OutboundEntity[]): IOutboundResponse {
      return {
         success: true,
         outbounds: outbound 
     };
   }
}
