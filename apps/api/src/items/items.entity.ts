import { PurchaseOrderItemsEntity } from "../orders/entities/order-items.entity";
import { InventoryEntity } from "../inventory/inventory.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InboundItemEntity } from "../inbound/entities/inbound-item.entity";

@Entity({name: 'items'})
export class ItemsEntity {
    // Define item properties here
    @PrimaryGeneratedColumn('uuid')
    id_item: string;

    @Column({ unique: true })
    sku: string;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => InventoryEntity, (inventory) => inventory.item) 
    inventories: InventoryEntity[];

    @OneToMany(() => PurchaseOrderItemsEntity, (poi) => poi.item) 
    poItem: PurchaseOrderItemsEntity[];

    @OneToMany(() => InboundItemEntity, (inboundItem) => inboundItem.items) 
    inbound: InboundItemEntity[];

    @CreateDateColumn()
    created_at: Date;
}