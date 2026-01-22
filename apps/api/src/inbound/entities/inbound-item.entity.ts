import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InboundEntity } from "./inbound.entity";
import { PurchaseOrderItemsEntity } from "../../orders/entities/order-items.entity";
import { ItemsEntity } from "../../items/items.entity";

@Entity({ name: 'inbound_items'})
export class InboundItemEntity {
    @PrimaryGeneratedColumn('uuid')
    id_inbound_item: string;

    @Column()
    id_inbound: string;
    @ManyToOne(() => InboundEntity, (inbound) => inbound.items, { onDelete: 'CASCADE' })    
    @JoinColumn({ name: 'id_inbound'})
    inbound: InboundEntity;

    @Column()
    id_item: string;
    @ManyToOne(() => ItemsEntity, (item) => item.inbound)
    @JoinColumn({ name: 'id_item' })
    items: ItemsEntity;

    id_poi: string;
    @ManyToOne(() => PurchaseOrderItemsEntity)
    @JoinColumn({ name: 'id_poi' })
    poItem: PurchaseOrderItemsEntity;

    @Column({ type: 'int' })
    qty_received: number;

    @CreateDateColumn()
    created_at: Date;
 
}