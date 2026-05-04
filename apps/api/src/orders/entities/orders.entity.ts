import { SupplierEntity } from "../../suppliers/suppliers.entity";
import { PurchaseOrderItemsEntity } from "./order-items.entity";
import { UserEntity } from "../../user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InboundEntity } from "../../inbound/entities/inbound.entity";

export enum PurchaseOrderStatus {
  PENDING = 'PENDING',     
  RECEIVED = 'RECEIVED',   
  CANCELED = 'CANCELED',   
  COMPLETED = 'COMPLETED', 
}

@Entity({name: 'purchase_orders'})
export class OrderEntity {
    // Define order entity columns and relations here
    @PrimaryGeneratedColumn('uuid')
    id_po: string;

    @Column()
    id_user: string;
    @ManyToOne(() => UserEntity, (user) => user.order)
    @JoinColumn({ name: 'id_user' })
    createdBy: UserEntity;

    @Column({ unique: true })
    po_number: string;

    @Column()
    id_supplier: string;
    @ManyToOne(() => SupplierEntity, (supplier) => supplier.purchaseOrder)
    @JoinColumn({ name: 'id_supplier' })
    supplier: SupplierEntity;

    @Column({ type: 'date', nullable: true })
    expected_delivery_date: Date;

    @Column({
        type: "enum",
        enum: PurchaseOrderStatus,
        default: PurchaseOrderStatus.PENDING,
        nullable: false
    })
    po_status: PurchaseOrderStatus;

    @Column()
    note: string;

    @UpdateDateColumn()
    last_updated: Date;

    @CreateDateColumn({
        type: "timestamp"
    })
    created_at: Date;

    @OneToMany(() => PurchaseOrderItemsEntity, (poi) => poi.purchaseOrder, { cascade: true })
    @JoinColumn({ name: 'id_poi' })
    items: PurchaseOrderItemsEntity[];

    // Di dalam OrderEntity
    @OneToMany(() => InboundEntity, (inbound) => inbound.purchaseOrder)
    inbound_shipments: InboundEntity[];
}