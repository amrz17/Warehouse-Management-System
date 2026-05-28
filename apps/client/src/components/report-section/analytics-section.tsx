import { useEffect, useState } from "react";
import { fetchInbound } from "@/api/inbound.api";
import { fetchOutbound } from "@/api/outbound.api";
import { fetchItems } from "@/api/item.api";
import { DataTable } from "@/components/data-table";
import { ExportButton } from "@/components/export-button";
import type { ExportColumn } from "@/lib/export-utils";
import type { ColumnDef } from "@tanstack/react-table";
import { IconTrendingUp, IconLoader2, IconAlertCircle } from "@tabler/icons-react";

interface ActiveItemData {
  sku: string;
  name: string;
  inboundQty: number;
  outboundQty: number;
  totalTransactions: number;
  totalQty: number;
}

const analyticsExportColumns: ExportColumn[] = [
  { header: "No", accessor: "_rowNum" },
  { header: "SKU", accessor: "sku" },
  { header: "Item Name", accessor: "name" },
  { header: "Inbound Qty", accessor: "inboundQty" },
  { header: "Outbound Qty", accessor: "outboundQty" },
  { header: "Total Qty Movement", accessor: "totalQty" },
  { header: "Total Transactions", accessor: "totalTransactions" },
];

export const columnsActiveItems: ColumnDef<ActiveItemData>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <div className="text-center text-muted-foreground">{row.index + 1}</div>,
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "name",
    header: "Item Name",
  },
  {
    accessorKey: "inboundQty",
    header: "Inbound Qty",
    cell: ({ getValue }) => <span className="text-green-600 dark:text-green-400 font-medium">+{getValue<number>()}</span>
  },
  {
    accessorKey: "outboundQty",
    header: "Outbound Qty",
    cell: ({ getValue }) => <span className="text-red-600 dark:text-red-400 font-medium">-{getValue<number>()}</span>
  },
  {
    accessorKey: "totalQty",
    header: "Total Qty Movement",
    cell: ({ getValue }) => <span className="font-semibold">{getValue<number>()}</span>
  },
  {
    accessorKey: "totalTransactions",
    header: "Total Transactions",
    cell: ({ getValue }) => <span className="font-medium">{getValue<number>()}</span>
  }
];

const AnalyticsTabContent = () => {
  const [data, setData] = useState<ActiveItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(false);
        const [inbounds, outbounds, items] = await Promise.all([
          fetchInbound(),
          fetchOutbound(),
          fetchItems()
        ]);

        const itemMap: Record<string, { sku: string; name: string }> = {};
        items?.forEach((item: any) => {
          if (item.id_item) {
            itemMap[item.id_item] = {
              sku: item.sku || "N/A",
              name: item.name || "Unknown Item",
            };
          }
        });

        const grouped: Record<string, { sku: string; name: string; inboundQty: number; outboundQty: number; totalTransactions: number }> = {};

        inbounds?.forEach(ib => {
          ib.items?.forEach(itemObj => {
            const itemInfo = itemMap[itemObj.id_item] || {
              sku: "N/A",
              name: itemObj.item?.name || "Unknown Item"
            };
            const sku = itemInfo.sku;
            const name = itemInfo.name;
            const key = sku !== "N/A" ? sku : name;

            if (!grouped[key]) {
              grouped[key] = { sku, name, inboundQty: 0, outboundQty: 0, totalTransactions: 0 };
            }
            grouped[key].inboundQty += itemObj.qty_received ?? 0;
            grouped[key].totalTransactions += 1;
          });
        });

        outbounds?.forEach(ob => {
          ob.items?.forEach(itemObj => {
            const itemInfo = itemMap[itemObj.id_item] || {
              sku: "N/A",
              name: itemObj.item?.name || "Unknown Item"
            };
            const sku = itemInfo.sku;
            const name = itemInfo.name;
            const key = sku !== "N/A" ? sku : name;

            if (!grouped[key]) {
              grouped[key] = { sku, name, inboundQty: 0, outboundQty: 0, totalTransactions: 0 };
            }
            grouped[key].outboundQty += itemObj.qty_shipped ?? 0;
            grouped[key].totalTransactions += 1;
          });
        });

        const sortedData = Object.entries(grouped)
          .map(([_, details]) => ({
            ...details,
            totalQty: details.inboundQty + details.outboundQty
          }))
          .sort((a, b) => b.totalQty - a.totalQty);

        setData(sortedData);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const exportData = data.map((item, index) => ({
    ...item,
    _rowNum: index + 1,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <IconLoader2 className="size-6 animate-spin mr-2" />
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive p-4 text-center">
        <IconAlertCircle className="size-8 mb-2" />
        <p>Failed to load analytics data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <IconTrendingUp className="size-5 text-primary" />
          <h3 className="text-lg font-semibold">
            Top Most Active Items
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({data.length} items ranked by total movement)
            </span>
          </h3>
        </div>

        <DataTable
          columns={columnsActiveItems}
          data={data}
          exportComponent={
            <div className="hidden lg:flex">
              <ExportButton
                fileName="top-active-items-report"
                title="Top Most Active Items Report"
                sheetName="Active Items"
                columns={analyticsExportColumns}
                data={exportData as unknown as Record<string, unknown>[]}
              />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default AnalyticsTabContent;