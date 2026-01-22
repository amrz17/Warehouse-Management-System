import { OrderEntity } from "../../orders/entities/orders.entity";
import { SupplierEntity } from "../../suppliers/suppliers.entity";
import { UserEntity } from "../../user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InboundItemEntity } from "./inbound-item.entity";

@Entity({ name: 'inbounds' })
export class InboundEntity {
    // Define your entity columns and relations here
    @PrimaryGeneratedColumn('uuid')
    id_inbound: string;

    @Column({ unique: true })
    inbound_number: string;

    @Column()
    id_po: string;
    @ManyToOne(() => OrderEntity, (order) => order.inbound_shipments)
    @JoinColumn( { name: 'id_po' } )
    purchaseOrder: OrderEntity;

    @Column()
    id_user: string;
    @ManyToOne(() => UserEntity, (user) => user.inbounds)
    @JoinColumn( { name: 'id_user' } )
    receivedBy: UserEntity;

    @Column()
    received_at: Date;

    @Column()
    id_supplier: string;
    @ManyToOne(() => SupplierEntity, (supplier) => supplier.inbound)
    @JoinColumn({ name: 'id_supplier' })
    supplierName: SupplierEntity;

    @Column({ nullable: true })
    note: string;

    @OneToMany(() => InboundItemEntity, (inboundItem) => inboundItem.inbound)
    @JoinColumn({ name: 'id_inbound_item' })
    items: InboundItemEntity[];

    @CreateDateColumn({
        type: "timestamp"
    })
    created_at: Date;
}