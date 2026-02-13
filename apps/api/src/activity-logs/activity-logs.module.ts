import { Module } from '@nestjs/common';
import { ActivityLogsController } from './activity-logs.controller';
import { ActivityLogsService } from './activity-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsEntity } from './entities/activity-logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    ActivityLogsEntity
  ])],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService]
})
export class ActivityLogsModule {}
