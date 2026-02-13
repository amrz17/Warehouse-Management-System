import { Controller } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';

@Controller('activity-logs')
export class ActivityLogsController {
    constructor(
        private readonly activityLogsService: ActivityLogsService
    ) {}

    // TODO : Add endpoints to handle activity logs here
}

