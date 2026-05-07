import AnalyticsTabContent from "@/components/report-section/analytics-section"
import StockTabContent from "@/components/report-section/stock-section"
import TransactionTabContent from "@/components/report-section/transaction-section"
import { TableTabTrigger } from "@/components/tabs-table"
import { TableTabsList } from "@/components/ui/table"
import DahsboardLayout from "@/layout/DashboardLayout"
import { useState } from "react"

// TODO : Make feature reporting page, where user can view report of their inbound and outbound history, and also generate report in pdf or excel format
export default function Reporting() {
  const [activeTab, setActiveTab] = useState<"stock" | "transaction" | "analytics">("stock")

  return (
    <DahsboardLayout>
      <div className="flex flex-1 flex-col lg:p-4 md:p-6">

        <div className="flex flex-col gap-4">
          <TableTabsList>
            <TableTabTrigger 
              isActive={activeTab === "stock"}
              onClick={() => setActiveTab("stock")}
            >
              Stock Report
            </TableTabTrigger>

            <TableTabTrigger 
              isActive={activeTab === "transaction"}
              onClick={() => setActiveTab("transaction")}
            >
              Transaction History
            </TableTabTrigger>

            <TableTabTrigger 
              isActive={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </TableTabTrigger>
          </TableTabsList>

          <div className="lg:mt-2 transition-all">
            {activeTab === "stock" && <StockTabContent />}
            {activeTab === "transaction" && <TransactionTabContent />}
            {activeTab === "analytics" && <AnalyticsTabContent />}
          </div>

        </div>
      </div>
    </DahsboardLayout>
  )
}