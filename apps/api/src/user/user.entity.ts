import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { InboundEntity } from "../inbound/entities/inbound.entity";
import { OrderEntity } from "../orders/entities/orders.entity";
import { SalesOrderEntity } from "../sales/entities/sales-order.entity";
import { OutboundEntity } from "../outbound/entities/outbound.entity";
import { InventoryEntity } from "../inventory/inventory.entity";
import { ActivityLogsEntity } from "../activity-logs/entities/activity-logs.entity";

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF_GUDANG = 'STAFF_GUDANG', 
  PICKER = 'PICKER',             
}

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id_user: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: false
    })
    full_name: string;

    @Column({
        type: "varchar",
        length: 50,
        unique: true,
        nullable: false
    })
    username: string;

    @Column({
        nullable: true
    })
    email: string;

    @Column({
        nullable: false
    })
    password?: string;

    @BeforeInsert()
    async hashPassword() {
        if(this.password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.STAFF_GUDANG,
        nullable: false
    })
    role: UserRole;

    @CreateDateColumn({
        type: "timestamp"
    })
    created_at: Date;

    @OneToMany(() => InventoryEntity, (inv) => inv.createdBy)
    invs: InventoryEntity[];  
    
    @OneToMany(() => OrderEntity, (order) => order.createdBy)
    order: OrderEntity[];  

    @OneToMany(() => InboundEntity, (inbound) => inbound.receivedBy)
    inbounds: InboundEntity[];  

    @OneToMany(() => SalesOrderEntity, (sale) => sale.createdBy)
    sales: SalesOrderEntity[];  

    @OneToMany(() => OutboundEntity, (outbound) => outbound.shipped_by)
    outbounds: OutboundEntity[];  

    @OneToMany(() => ActivityLogsEntity, (log) => log.createdBy)
    logs: ActivityLogsEntity[];  
}