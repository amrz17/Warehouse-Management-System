import { InboundItemEntity } from "../../inbound/entities/inbound-item.entity";
import { ItemsEntity } from "../../items/items.entity";
import { OrderEntity } from "./orders.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'purchase_order_items' })
export class PurchaseOrderItemsEntity {
  // Define your entity columns and relations here
    @PrimaryGeneratedColumn('uuid')
    id_poi: string;

    @Column()
    id_po: string;
    @ManyToOne(() => OrderEntity, (purchaseOrder) => purchaseOrder.items)
    @JoinColumn({ name: 'id_po' })
    purchaseOrder: OrderEntity;

    @Column()
    id_item: string;
    @ManyToOne(() => ItemsEntity, (poi) => poi.poItem)
    @JoinColumn({ name: 'id_item' })
    item: ItemsEntity;

    @Column()
    qty_ordered: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price_per_unit: number;

    @Column({ default: 0 })
    qty_received: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_price: number;

    @OneToMany(() => InboundItemEntity, (inboundItem) => inboundItem.poItem)
    inboundItem: InboundItemEntity[];
}