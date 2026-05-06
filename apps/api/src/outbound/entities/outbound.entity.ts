import { SalesOrderEntity } from "../../sales/entities/sales-order.entity";
import { UserEntity } from "../../user/user.entity";
import { OutboundItemEntity } from "./outbound-item.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum StatusOutbound {
    OPEN = "OPEN",
    PICKING = "PICKING",
    SHIPPED = "SHIPPED",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED"
}

@Entity({ name: 'outbound' })
export class OutboundEntity {
    // Define your entity columns and relations here
    @PrimaryGeneratedColumn('uuid')
    id_outbound: string;

    @Column({ unique: true })
    outbound_number: string;

    @Column()
    id_so: string;
    @ManyToOne(() => SalesOrderEntity)
    @JoinColumn( { name: 'id_so' } )
    sales_order: SalesOrderEntity;

    @Column()
    id_user: string;
    @ManyToOne(() => UserEntity)
    @JoinColumn( { name: 'id_user' } )
    shipped_by: UserEntity;

    @Column()
    shipped_at: Date;

    @Column({ nullable: true })
    carrier_name: string;

    @Column({ nullable: true })
    tracking_number: string;

    @Column({
        type: 'enum',
        enum: StatusOutbound,
        default: StatusOutbound.OPEN,
        nullable: false
    })
    status_outbound: StatusOutbound;

    @Column({ nullable: true })
    note: string;

    @UpdateDateColumn()
    updated_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => OutboundItemEntity, (outboundItem) => outboundItem.outbound, { cascade: true })
    @JoinColumn({ name: 'id_outbound_item' })
    items: OutboundItemEntity[];

}