import { IActivityLogs } from "./activity-logs.type";

export interface IActivityLogsResponse {
    success: boolean;
    message: string;
    data: IActivityLogs | IActivityLogs[];
}