import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum OrderStatus {
    PENDING = "pending",
    APPROVED = "approved",
    SHIPPED = "shipped",
    RECEIVED = "received",
    CANCELED = "canceled",
    COMPLETED = "completed",
}

@Entity({name: 'purchase_orders'})
export class OrderEntity {
    // Define order entity columns and relations here
    @PrimaryGeneratedColumn('uuid')
    id_po: string;

    @Column()
    id_user: string;

    @Column()
    po_code: string;

    @Column()
    date_po: Date;

    // @Column()
    // total_amount: number;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.PENDING,
        nullable: false
    })
    po_status: string;

    @Column()
    note: string;

    @CreateDateColumn({
        type: "timestamp"
    })
    update_at: Date;

    @CreateDateColumn({
        type: "timestamp"
    })
    created_at: Date;
}