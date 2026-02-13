import { ActivityLogsEntity } from "../entities/activity-logs.entity";

export type IActivityLogs = Omit<ActivityLogsEntity, 'id_logs' | 'created_at'>;