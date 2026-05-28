import { useEffect, useState } from "react";
import { fetchInventory } from "@/api/inventory.api";
import { ExportButton } from "@/components/export-button";
import type { ExportColumn } from "@/lib/export-utils";
import type { InventoryPayload } from "@/schemas/schema";
import { DataTable } from "@/components/data-table";
import { IconPackage, IconLoader2, IconAlertTriangle } from "@tabler/icons-react";
import { columnsStockReport, columnsLowStockReport } from "@/components/columns-stock-report";

const stockExportColumns: ExportColumn[] = [
  { header: "No", accessor: "_rowNum" },
  { header: "Item Name", accessor: "item.name" },
  { header: "Location (Bin)", accessor: "location.bin_code" },
  { header: "Qty Available", accessor: "qty_available" },
  { header: "Min Stock", accessor: "min_stock" },
  { header: "Max Stock", accessor: "max_stock" },
  { header: "Qty Ordered", accessor: "qty_ordered" },
  { header: "Qty Reserved", accessor: "qty_reserved" },
  { header: "Last Updated", accessor: "_lastUpdate" },
];

const StockTabContent = () => {
  const [inventory, setInventory] = useState<InventoryPayload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchInventory();
        setInventory(data || []);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Prepare export data with row numbers and formatted dates
  const exportData = inventory.map((item, index) => ({
    ...item,
    _rowNum: index + 1,
    _lastUpdate: item.last_update
      ? new Date(item.last_update).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      : "-",
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <IconLoader2 className="size-6 animate-spin mr-2" />
        Loading stock data...
      </div>
    );
  }

  // Low Stock Computation
  const DEFAULT_THRESHOLD = 10;
  const allLowStockItems = inventory.filter((item) => {
    const qty = item.qty_available ?? 0;
    const minS = item.min_stock ?? 0;
    const threshold = minS > 0 ? minS : DEFAULT_THRESHOLD;
    return qty < threshold;
  });

  return (
    <div className="space-y-6">
      {/* Main Stock Report Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <IconPackage className="size-5 text-green-600" />
          <h3 className="text-lg font-semibold">
            Stock Report
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({inventory.length} items)
            </span>
          </h3>
        </div>

        <DataTable
          columns={columnsStockReport}
          data={inventory}
          exportComponent={
            <div className="hidden lg:flex">
              <ExportButton
                fileName="stock-report"
                title="Stock Report"
                sheetName="Stock"
                columns={stockExportColumns}
                data={exportData as unknown as Record<string, unknown>[]}
              />
            </div>
          }
        />
      </div>

      {/* Low Stock Alert Section */}
      {allLowStockItems.length > 0 && (
        <div className="space-y-2 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-red-100 dark:bg-red-950">
              <IconAlertTriangle className="size-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h4 className="text-base font-semibold">Low Stock Alert</h4>
              <p className="text-xs text-muted-foreground">
                {allLowStockItems.length} item{allLowStockItems.length !== 1 ? "s" : ""} below minimum stock level
              </p>
            </div>
          </div>

          <DataTable
            columns={columnsLowStockReport}
            data={allLowStockItems}
          />
        </div>
      )}
    </div>
  );
};

export default StockTabContent;