import { UserEntity } from "../user/user.entity";
import { ItemsEntity } from "../items/items.entity";
import { LocationEntity } from "../locations/locations.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity({name: 'inventory'})
@Unique(['item', 'location'])
export class InventoryEntity {
    // Define inventory properties here
    @PrimaryGeneratedColumn('uuid')
    id_inventory: string;

    @Column()
    id_user: string;

    @ManyToOne(() => UserEntity, (user) => user.invs)
    @JoinColumn({ name: 'id_user' })
    createdBy: UserEntity;

    @Column()
    id_item: string;

    @ManyToOne(() => ItemsEntity, (item) => item.inventories)
    @JoinColumn({ name: 'id_item' })
    item: ItemsEntity;

    @Column()
    id_location: string;

    @ManyToOne(() => LocationEntity, (location) => location.inventories)
    @JoinColumn({ name: 'id_location' })
    location: LocationEntity;

    @Column({ type: 'int', default: 0 })
    qty_available: number;

    @Column({ type: 'int', default: 0 })
    qty_reserved: number;

    @Column({ type: 'int', default: 0 })
    qty_ordered: number;

    @UpdateDateColumn()
    last_updated: Date;

    @CreateDateColumn()
    created_at: Date;
}