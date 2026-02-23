import type { ActivityLogsPayload } from "@/schemas/schema"
import api from "./axios"

//
export const fetchActivityLogs = async (): Promise<ActivityLogsPayload[]> => {
    const res = await api.get("/activity-logs")
    return res.data.logs
}