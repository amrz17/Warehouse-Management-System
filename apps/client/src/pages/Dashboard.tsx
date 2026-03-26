import { fetchActivityLogs } from "@/api/activity.logs.api";
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { columnsActivityLogs } from "@/components/column-activity-logs";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards"
import DahsboardLayout from "@/layout/DashboardLayout"
import type { ActivityLogsPayload } from "@/schemas/schema";
import { isAdmin, getToken } from "@/services/auth.service";
import { useEffect, useState } from "react";

// TODO : Add sales chart
// TODO : Add recent activities
// TODO : Make line chart tren inbound vs outbound
// TODO : Make docunt chart inventory info
export default function Page() {

  const [data, setData] = useState<ActivityLogsPayload[]>([]);

  const fetchDataActivity = async () => {
    const logs = await fetchActivityLogs();
    // console.log("Logs: ",logs);
    setData(logs);
  }

  // useEffect(() => {
  //   fetchDataActivity();
  // }, []);

  useEffect(() => {
    if (!isAdmin()) return; 

    // const fetchLogs = async () => {
    //   const res = await fetch('/api/activity-logs', {
    //     headers: {
    //       'Authorization': `Bearer ${getToken()}` 
    //     }
    //   });

    //   if (!res.ok) return; 

    //   const logs = await res.json();
    //   setData(logs);
    // };

    // fetchLogs();
    fetchDataActivity();
  }, []);

  return (
    <DahsboardLayout>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            {isAdmin() && ( // ← table hanya render kalau admin
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            )}
            {isAdmin() && ( // ← table hanya render kalau admin
              <DataTable columns={columnsActivityLogs()} data={data} />
            )}
          </div>
        </div>
      </div>
    </DahsboardLayout>
  )
}