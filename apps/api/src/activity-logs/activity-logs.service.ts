import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLogsEntity } from './entities/activity-logs.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ActivityLogsService {
    constructor(
        @InjectRepository(ActivityLogsEntity) 
        private readonly activityLogsRepo: Repository<ActivityLogsEntity>,
        private readonly dataSource: DataSource
    ) {}

    // TODO : Add methods to handle activity logs here
}
