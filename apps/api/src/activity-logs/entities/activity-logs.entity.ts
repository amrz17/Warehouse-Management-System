import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export class ActivityLogsEntity {
    @PrimaryGeneratedColumn('uuid')
    id_logs: string;

    @Column()
    id_user: string;

    @Column({
        type: 'enum',
        enum: ['CREATE', 'UPDATE', 'DELETE', 'CANCEL', 'LOGIN', 'LOGOUT' ],
    })
    action: string;

    @Column()
    module: string;

    @Column()
    resource_id: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    metadata: string;

    @CreateDateColumn()
    created_at: Date;
}