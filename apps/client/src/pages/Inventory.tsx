"use client"

import { useState } from "react"
import DahsboardLayout from "@/layout/DashboardLayout"
import { TableTabsList, TableTabTrigger } from "@/components/ui/table"
import InventoryTabContent from "@/components/inventory-components/inventory-tab-content"
import ItemsTabContent from "@/components/item-components/items-tab-content"
import LocationTabContent from "@/components/location-components/location-tab-content"

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<"inventory" | "item" | "location">("inventory")

  return (
    <DahsboardLayout>
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex flex-col gap-4">
          
          {/* NAVIGASI TABS */}
          <TableTabsList>
            <TableTabTrigger 
              isActive={activeTab === "inventory"} 
              onClick={() => setActiveTab("inventory")}
            >
              Inventory
            </TableTabTrigger>
            <TableTabTrigger 
              isActive={activeTab === "item"} 
              onClick={() => setActiveTab("item")}
            >
              Items
            </TableTabTrigger>
            <TableTabTrigger 
              isActive={activeTab === "location"} 
              onClick={() => setActiveTab("location")}
            >
              Locations
            </TableTabTrigger>
          </TableTabsList>

          {/* KONTEN DINAMIS */}
          <div className="mt-2 transition-all">
            {activeTab === "inventory" && <InventoryTabContent />}
            {activeTab === "item" && <ItemsTabContent />}
            {activeTab === "location" && <LocationTabContent />}
          </div>

        </div>
      </div>
    </DahsboardLayout>
  )
}