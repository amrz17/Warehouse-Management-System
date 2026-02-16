import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLogsEntity } from './entities/activity-logs.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';

export interface ICreateLog {
    id_user: string;
    action: string;
    module: string;
    resource_id?: string;
    description?: string;
    metadata?: any;
}

@Injectable()
export class ActivityLogsService {
    constructor(
        @InjectRepository(ActivityLogsEntity) 
        private readonly activityLogsRepo: Repository<ActivityLogsEntity>,
        private readonly dataSource: DataSource
    ) {}

    // TODO : Add methods to handle activity logs here
    // create log
    async createLogs (
        manager: EntityManager,
        payload: ICreateLog
    ) {
        const log = manager.create(ActivityLogsEntity, {
            createdBy: { id_user: payload.id_user },
            action: payload.action,
            module: payload.module,
            resource_id: payload.resource_id,
            description: payload.description,
            metadata: payload.metadata
        });
        return await manager.save(log);
    }    

}
