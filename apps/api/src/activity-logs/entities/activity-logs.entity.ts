import { UserEntity } from "../../user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'activity_logs' })
export class ActivityLogsEntity {
    @PrimaryGeneratedColumn('uuid')
    id_logs: string;

    @Column()
    id_user: string;
    @ManyToOne(() => UserEntity, (user) => user.logs)
    @JoinColumn({ name: 'id_user' })
    createdBy: UserEntity;

    @Column({
        type: 'enum',
        enum: ['CREATE', 'UPDATE', 'DELETE', 'CANCEL', 'LOGIN', 'LOGOUT' ],
    })
    action: string;

    @Column()
    module: string;

    @Column({ nullable: true })
    resource_id: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'json', nullable: true})
    metadata: any;

    @CreateDateColumn()
    created_at: Date;
}