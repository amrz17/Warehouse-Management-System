import { SalesOrderEntity } from "../sales/entities/sales-order.entity";
import { UserEntity } from "../user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'outbounds' })
export class OutboundEntity {
    // Define your entity columns and relations here
    @PrimaryGeneratedColumn('uuid')
    id_outbound: string;

    @Column({ unique: true })
    outbound_number: string;

    @ManyToOne(() => SalesOrderEntity)
    @JoinColumn( { name: 'id_so' } )
    sales_order: SalesOrderEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn( { name: 'id_user' } )
    shipped_by: UserEntity;

    @Column()
    shipped_at: Date;

    @Column()
    carrier_name: string;

    @Column()
    tracking_number: string;

    @Column()
    total_items: number;

    @Column({ nullable: true })
    note: string;

    @UpdateDateColumn()
    updated_at: Date;

    @CreateDateColumn()
    created_at: Date;
}