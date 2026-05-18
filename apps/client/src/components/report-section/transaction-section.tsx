import { useEffect, useState } from "react";
import { fetchInbound } from "@/api/inbound.api";
import { fetchOutbound } from "@/api/outbound.api";
import { ExportButton } from "@/components/export-button";
import type { ExportColumn } from "@/lib/export-utils";
import type { InboundPayload, OutboundPayload } from "@/schemas/schema";
import { DataTable } from "@/components/data-table";
import { IconLoader2, IconArrowsExchange } from "@tabler/icons-react";
import { columnsTransactionHistory, type UnifiedTransaction } from "@/components/columns-transaction-history";

type TransactionType = "all" | "inbound" | "outbound";

const transactionExportColumns: ExportColumn[] = [
  { header: "No", accessor: "_rowNum" },
  { header: "Transaction No.", accessor: "number" },
  { header: "Type", accessor: "type" },
  { header: "Reference", accessor: "reference" },
  { header: "Handled By", accessor: "handler" },
  { header: "Status", accessor: "status" },
  { header: "Items", accessor: "itemCount" },
  { header: "Date", accessor: "_formattedDate" },
];

const TransactionTabContent = () => {
  const [inbounds, setInbounds] = useState<InboundPayload[]>([]);
  const [outbounds, setOutbounds] = useState<OutboundPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<TransactionType>("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [inboundData, outboundData] = await Promise.all([
          fetchInbound(),
          fetchOutbound(),
        ]);
        setInbounds(inboundData || []);
        setOutbounds(outboundData || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Unify inbound + outbound into one list
  const transactions: UnifiedTransaction[] = [
    ...inbounds.map((ib) => ({
      id: ib.id_inbound ?? "",
      number: ib.inbound_number ?? "-",
      type: "Inbound" as const,
      reference: ib.purchaseOrder?.po_number ?? "-",
      handler: ib.receivedBy?.name ?? "-",
      status: ib.status_inbound ?? "-",
      date: ib.received_at ?? ib.created_at ?? "",
      note: ib.note ?? "",
      itemCount: ib.items?.length ?? 0,
    })),
    ...outbounds.map((ob) => ({
      id: ob.id_outbound ?? "",
      number: ob.outbound_number ?? "-",
      type: "Outbound" as const,
      reference: ob.sales_order?.so_number ?? "-",
      handler: ob.shipped_by?.name ?? "-",
      status: ob.status_outbound ?? "-",
      date: ob.shipped_at ?? ob.created_at ?? "",
      note: ob.note ?? "",
      itemCount: ob.items?.length ?? 0,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter by type
  const filtered = transactions.filter((tx) => {
    if (typeFilter !== "all" && tx.type.toLowerCase() !== typeFilter) return false;
    return true;
  });

  // Export data
  const exportData = filtered.map((tx, index) => ({
    ...tx,
    _rowNum: index + 1,
    _formattedDate: tx.date
      ? new Date(tx.date).toLocaleDateString("en-US", {
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
        Loading transaction data...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Type filter pills & Header Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <IconArrowsExchange className="size-5 text-blue-600" />
          <h3 className="text-lg font-semibold">
            Transaction History
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filtered.length} records)
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {(["all", "inbound", "outbound"] as TransactionType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setTypeFilter(type);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${typeFilter === type
                ? "bg-green-600 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
            >
              {type === "all" ? "All" : type === "inbound" ? "Inbound" : "Outbound"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columnsTransactionHistory}
        data={filtered}
        exportComponent={
          <div className="hidden lg:flex">
            <ExportButton
              fileName="transaction-history"
              title="Transaction History Report"
              sheetName="Transactions"
              columns={transactionExportColumns}
              data={exportData as unknown as Record<string, unknown>[]}
            />
          </div>
        }
      />
    </div>
  );
};

export default TransactionTabContent;