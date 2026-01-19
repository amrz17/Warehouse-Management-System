import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { InboundEntity } from "../inbound/inbound.entity";
import { OrderEntity } from "../orders/orders.entity";

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
    
    @OneToMany(() => OrderEntity, (order) => order.createdBy)
    order: OrderEntity[];  

    @OneToMany(() => InboundEntity, (inbound) => inbound.receivedBy)
    inbounds: InboundEntity[];  
}