import { SupplierEntity } from "../suppliers/suppliers.entity";
import { PurchaseOrderItemsEntity } from "../purchase-order-items/order-items.entity";
import { UserEntity } from "../user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InboundEntity } from "../inbound/inbound.entity";

export enum PurchaseOrderStatus {
  PENDING = 'PENDING',     // Baru dibuat, menunggu persetujuan manager
  APPROVED = 'APPROVED',   // Sudah oke, sudah dikirim ke supplier
  SHIPPED = 'SHIPPED',     // Supplier sudah kirim, barang di jalan
  RECEIVED = 'RECEIVED',   // Barang sudah sampai di gudang & di-input ke stok
  CANCELED = 'CANCELED',   // Batal beli
  COMPLETED = 'COMPLETED', // Selesai (Administrasi & stok sudah sinkron)
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