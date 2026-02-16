import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InventoryEntity } from './inventory.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { IInventory } from './types/inventory.type';
import { IInventoryResponse } from './types/inventoryResponse.interface';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { ActivityLogsService  } from '../activity-logs/activity-logs.service';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(InventoryEntity)
        private readonly inventoryRepository: Repository<InventoryEntity>,
        private readonly dataSource: DataSource,
        private readonly activityLogsService: ActivityLogsService
    ) {}

    // get all
    async getAllInventory(): Promise<InventoryEntity[]> {
        return this.inventoryRepository.find({
            relations: ['item', 'location']
        })
    }

    // create Inventory
    async createInventory(
        createInventoryDto: CreateInventoryDto,
        userId: string
    ): Promise<InventoryEntity> {

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // inisialisasi dan simpan inventory
            const newInventory = queryRunner.manager.create(InventoryEntity, {
                ...createInventoryDto,
                id_user: userId
            });

            const savedInventory = queryRunner.manager.save(newInventory);            

            // simpan logs
            await this.activityLogsService.createLogs(queryRunner.manager, {
                id_user: userId,
                action: 'CREATE',
                module: "INVENTORY",
                resource_id: (await savedInventory).id_inventory,
                description: `Add new stock for id item: ${(await savedInventory).id_item}`,
                metadata: {
                    initial_qty: (await savedInventory).qty_available,
                    location: (await savedInventory).location
                }
            })

            await queryRunner.commitTransaction();
            return savedInventory;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release()
        }

    }

    // update Inventory
    async updateInventory(
        id_inventory: string,
        updateInventroyDto: UpdateInventoryDto,
        userId: string
    ): Promise<InventoryEntity> {

        // const inventory = await this.inventoryRepository.findOne({ where: { id_inventory }})
        // if (!inventory) {
        //     throw new NotFoundException('Inventory Not Found!')
        // }

        // Object.assign(inventory, updateInventroyDto);

        // return this.inventoryRepository.save(inventory);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // data lama
            const oldInventory = await queryRunner.manager.findOne(InventoryEntity, {
                where: { id_inventory }
            });

            if (!oldInventory) {
                throw new NotFoundException('Inventory Not Found!')
            }

            const oldDataSnapshot = { ...oldInventory };

            // update data
            Object.assign(oldInventory, updateInventroyDto);

            const updateInventory = await queryRunner.manager.save(oldInventory);

            // save log
            await this.activityLogsService.createLogs(queryRunner.manager, {
                id_user: userId,
                action: 'UPDATE',
                module: 'INVENTORY',
                resource_id: id_inventory,
                description: `Update inventory item ${oldInventory.id_item}`,
                metadata: {
                    before: {
                        qty_available: oldDataSnapshot.qty_available,
                        location: oldDataSnapshot.location
                    },
                    after: {
                        qty_available: updateInventory.qty_available,
                        location: updateInventory.location
                    }
                }
            });

            await queryRunner.commitTransaction();
            return updateInventory;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error; 
        } finally {
            await queryRunner.release();
        }
    }

    // // delete inventory
    // async deleteInventory(
    //     id_inventory: string,
    // ): Promise<void> {
    //     await this.inventoryRepository.delete({ id_inventory });
    // }

    async deleteInventory(
        id_inventory: string,
        userId: string 
    ): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // find data
            const inventory = await queryRunner.manager.findOne(InventoryEntity, { 
                where: { id_inventory } 
            });

            if (!inventory) {
                throw new NotFoundException('Inventory Not Found!');
            }

            // delete data
            await queryRunner.manager.delete(InventoryEntity, { id_inventory });

            // save log
            await this.activityLogsService.createLogs(queryRunner.manager, {
                id_user: userId,
                action: 'DELETE',
                module: 'INVENTORY',
                resource_id: id_inventory,
                description: `Menghapus data inventory untuk item SKU: ${inventory.id_item}`,
                metadata: { 
                    deleted_data: inventory, // Menyimpan seluruh object yang dihapus
                    deleted_at: new Date()
                }
            });

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // response
    generateResponseInventory(
        inventory: IInventory | IInventory[]
    ): IInventoryResponse {
        return {
            success: true,
            inventory: inventory
        }
    }
}
