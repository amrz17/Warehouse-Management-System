import DahsboardLayout from "@/layout/DashboardLayout"

// TODO : Make feature reporting page, where user can view report of their inbound and outbound history, and also generate report in pdf or excel format
export default function Reporting() {
  return (
    <DahsboardLayout>
        <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            </div>
        </div>
        </div>
    </DahsboardLayout>
  )
}