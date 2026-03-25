import type { ActivityLogsPayload } from "@/schemas/schema"
import api from "./axios"

//
export const fetchActivityLogs = async (): Promise<ActivityLogsPayload[]> => {
    const res = await api.get("/activity-logs")
    console.log("Response from logs: ", res);
    return res.data.logs
}