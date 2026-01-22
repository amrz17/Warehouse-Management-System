import { SalesOrderEntity } from "../sales/entities/sales-order.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'customers' })
export class CustomerEntity {
    // Define your entity columns and relations here
    @PrimaryGeneratedColumn('uuid')
    id_customer: string;

    @Column({ unique: true })
    customer_name: string;

    @Column({ type: 'text' , nullable: true })
    customer_address: string;

    @Column()
    customer_phone: string;

    @UpdateDateColumn()
    updated_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => SalesOrderEntity, (salesOrder) => salesOrder.customer)
    sales_orders: SalesOrderEntity[];
}