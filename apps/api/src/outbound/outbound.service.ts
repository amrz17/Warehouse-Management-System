import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OutboundEntity, StatusOutbound } from './entities/outbound.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateOutbounddDto } from './dto/create-outbound.dto';
import { OutboundItemEntity } from './entities/outbound-item.entity';
import { SaleOrderItemsEntity } from '../sales/entities/sale-order-items.entity';
import { SalesOrderEntity, SalesOrderStatus } from '../sales/entities/sales-order.entity';
import { InventoryEntity } from '../inventory/inventory.entity';
import { IOutboundResponse } from './types/outboundResponse.Interface';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ShipOutboundDto } from './dto/ship-outbound.dto';

@Injectable()
export class OutboundService {
    constructor(
        @InjectRepository(OutboundEntity)
        private readonly outboundRepo: Repository<OutboundEntity>,
        private readonly activityLogsService: ActivityLogsService,
        private readonly dataSource: DataSource
    ) {}

    async createOutbound(
        createOutboundDto: CreateOutbounddDto,
        userId: string
    ): Promise<any> {
        const queryRunner = await this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            // Format Outbound Number: OB-20260420-0001, OB-20260420-0002
            const count = await queryRunner.manager.count(OutboundEntity);
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const outboundNumber = `OB-${dateStr}-${String(count + 1).padStart(4, '0')}`;

            const outboundHeader = await queryRunner.manager.create(OutboundEntity, {
                outbound_number: outboundNumber,
                sales_order: { id_so: createOutboundDto.id_so },
                shipped_by: { id_user: userId },
                shipped_at: createOutboundDto.shipped_at,
                status_outbound: StatusOutbound.PICKING,
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

                // Validasi stok cukup
                if (!inventory || Number(inventory.qty_available) < Number(itemDto.qty_shipped)) {
                    throw new BadRequestException(
                        `Stok tidak mencukupi! Tersedia: ${inventory?.qty_available ?? 0}, Dibutuhkan: ${itemDto.qty_shipped}`
                    );
                }

                // Update qty_shipped di SaleOrderItems
                await queryRunner.manager.increment(SaleOrderItemsEntity, 
                    { id_soi: itemDto.id_soi },
                    "qty_shipped",
                    itemDto.qty_shipped
                );

                // Kurangi qty_available
                await queryRunner.manager.decrement(InventoryEntity, 
                    { id_inventory: inventory.id_inventory },
                    "qty_available",
                    itemDto.qty_shipped
                );

                // Tambah qty_reserved
                await queryRunner.manager.increment(InventoryEntity, 
                    { id_inventory: inventory.id_inventory },
                    "qty_reserved",
                    itemDto.qty_shipped
                );

                // Update status di SalesOrder jika semua item sudah terpenuhi
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

            // simpan logs
            await this.activityLogsService.createLogs(queryRunner.manager, {
                id_user: userId,
                action: 'CREATE',
                module: 'OUTBOUND',
                resource_id: (await saveOutbound).id_outbound,
                description: `${(await saveOutbound).outbound_number}`,
                metadata: {
                    ...saveOutbound
                }
            })

            // 
            await queryRunner.commitTransaction();
            return saveOutbound;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException('Failed make new Outbound: ', (error as Error).message); 
        } finally {
            await queryRunner.release();
        }
    }

    // 
    async shipOutbound(
        id_outbound: string,
        dto: ShipOutboundDto,
        userId: string
    ): Promise<OutboundEntity> {

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const outbound = await queryRunner.manager.findOne(OutboundEntity, {
                where: { id_outbound },
                relations: ['items']
            });

            if (!outbound) throw new NotFoundException('Outbound tidak ditemukan');

            if (outbound.status_outbound !== StatusOutbound.PICKING) {
                throw new BadRequestException(
                    'Hanya outbound dengan status PICKING yang bisa di-ship'
                );
            }

            // Update status outbound
            await queryRunner.manager.update(OutboundEntity,
                { id_outbound },
                {
                    status_outbound: StatusOutbound.SHIPPED,
                    tracking_number: dto.tracking_number,
                    carrier_name: dto.carrier_name,
                    shipped_at: new Date(),
                }
            );

            // Update qty_reserved di inventory — kurangi karena barang sudah keluar
            for (const item of outbound.items) {
                await queryRunner.manager.decrement(InventoryEntity,
                    { id_item: item.id_item },
                    'qty_reserved',
                    item.qty_shipped
                );
            }

            // Update status SO
            await this.updateSoStatus(outbound.id_so, queryRunner);

            // Simpan activity log
            await this.activityLogsService.createLogs(queryRunner.manager, {
                id_user: userId,
                action: 'UPDATE',
                module: 'OUTBOUND',
                resource_id: id_outbound,
                description: `Outbound ${outbound.outbound_number} shipped via ${dto.carrier_name}`,
                metadata: {
                    tracking_number: dto.tracking_number,
                    carrier_name: dto.carrier_name,
                    shipped_at: new Date(),
                }
            });

            await queryRunner.commitTransaction();

            const updatedOutbound = await queryRunner.manager.findOne(OutboundEntity, {
                where: { id_outbound }
            });

            if (!updatedOutbound) throw new NotFoundException('Outbound tidak ditemukan setelah update');

            return updatedOutbound;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            const message = err instanceof Error ? err.message : 'Unknown error';
            throw new BadRequestException('Gagal ship outbound: ' + message);
        } finally {
            await queryRunner.release();
        }
    }

    // 
    async completeOutbound(id_outbound: string, userId: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const outbound = await queryRunner.manager.findOne(OutboundEntity, {
                where: { id_outbound }
            });

            if (!outbound) throw new NotFoundException('Outbound tidak ditemukan');

            if (outbound.status_outbound !== StatusOutbound.SHIPPED) {
                throw new BadRequestException(
                    'Hanya outbound dengan status SHIPPED yang bisa di-complete'
                );
            }

            // Update status outbound
            await queryRunner.manager.update(OutboundEntity,
                { id_outbound },
                { status_outbound: StatusOutbound.COMPLETED }
            );

            // Update SO status ke COMPLETED
            await queryRunner.manager.update(SalesOrderEntity,
                { id_so: outbound.id_so },
                { so_status: SalesOrderStatus.COMPLETED }
            );

            // Simpan activity log
            await this.activityLogsService.createLogs(queryRunner.manager, {
                id_user: userId,
                action: 'UPDATE',
                module: 'OUTBOUND',
                resource_id: id_outbound,
                description: `Outbound ${outbound.outbound_number} completed`,
                metadata: { id_so: outbound.id_so }
            });

            await queryRunner.commitTransaction();

        } catch (err) {
            await queryRunner.rollbackTransaction();
            const message = err instanceof Error ? err.message : 'Unknown error';
            throw new BadRequestException('Gagal complete outbound: ' + message);
        } finally {
            await queryRunner.release();
        }
    }

    // 
    async cancelOutbound(
        id_outbound: string,
        userId: string
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
                await queryRunner.manager.increment(InventoryEntity,
                    { id_item: item.id_item },
                    "qty_reserved",
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

            // simpan logs
            await this.activityLogsService.createLogs(queryRunner.manager, {
                id_user: userId,
                action: 'CANCEL',
                module: 'OUTBOUND',
                resource_id: outbound.id_outbound,
                description: outbound.outbound_number,
                metadata: {
                    ...outbound
                }
            })

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

        let newStatus = SalesOrderStatus.APPROVED;
        if (totalShipped >= totalOrdered) {
            newStatus = SalesOrderStatus.SHIPPED;
        } else if (totalShipped > 0) {
            newStatus = SalesOrderStatus.PICKING;
        }

        // Update status ke tabel SO Header
        await queryRunner.manager.update(SalesOrderEntity, 
            { id_so: id_so }, 
            { so_status: newStatus as any }
        );
    }


    //
    async getAllOutbound(): Promise<OutboundEntity[]> {
        return await this.outboundRepo.find({
            relations: ['items.item', 'shipped_by', 'sales_order'],
            order: { created_at: 'DESC' }
        });
    }


   // function to generate order response
   generatedResponse(outbound: OutboundEntity | OutboundEntity[]): IOutboundResponse {
      return {
         success: true,
         outbounds: outbound 
     };
   }
}
