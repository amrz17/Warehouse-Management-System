import { InboundEntity } from "../inbound/entities/inbound.entity";
import { OrderEntity } from "../orders/entities/orders.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'suppliers'})
export class SupplierEntity {
    @PrimaryGeneratedColumn('uuid')
    id_supplier: string;

    @Column({ unique: true })
    name: string; 

    @Column({ type: 'text' })
    suppliers_address: string;

    @Column()
    pic_name: string;

    @OneToMany(() => OrderEntity, (order) => order.supplier)
    purchaseOrder: OrderEntity[];

    @OneToMany(() => InboundEntity, (inbound) => inbound.supplierName)
    inbound: InboundEntity[];
}