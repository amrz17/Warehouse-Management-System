import { useEffect, useState } from "react";
import { fetchInbound } from "@/api/inbound.api";
import { fetchOutbound } from "@/api/outbound.api";
import { ExportButton } from "@/components/export-button";
import type { ExportColumn } from "@/lib/export-utils";
import type { InboundPayload, OutboundPayload } from "@/schemas/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconSearch,
  IconArrowDown,
  IconArrowUp,
  IconLoader2,
  IconArrowsExchange,
} from "@tabler/icons-react";

type TransactionType = "all" | "inbound" | "outbound";

interface UnifiedTransaction {
  id: string;
  number: string;
  type: "Inbound" | "Outbound";
  reference: string;
  handler: string;
  status: string;
  date: string;
  note: string;
  itemCount: number;
}

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

const statusColor: Record<string, string> = {
  RECEIVED:
    "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 ring-green-600/20 dark:ring-green-300/20",
  COMPLETED:
    "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 ring-green-600/20 dark:ring-green-300/20",
  PARTIAL:
    "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 ring-amber-600/20 dark:ring-amber-300/20",
  OPEN: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-blue-600/20 dark:ring-blue-300/20",
  PICKING:
    "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-indigo-600/20 dark:ring-indigo-300/20",
  SHIPPED:
    "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 ring-purple-600/20 dark:ring-purple-300/20",
  CANCELED:
    "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 ring-red-600/20 dark:ring-red-300/20",
};

const TransactionTabContent = () => {
  const [inbounds, setInbounds] = useState<InboundPayload[]>([]);
  const [outbounds, setOutbounds] = useState<OutboundPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  // Filter by type and search
  const filtered = transactions.filter((tx) => {
    if (typeFilter !== "all" && tx.type.toLowerCase() !== typeFilter) return false;
    if (search) {
      const term = search.toLowerCase();
      return (
        tx.number.toLowerCase().includes(term) ||
        tx.reference.toLowerCase().includes(term) ||
        tx.handler.toLowerCase().includes(term) ||
        tx.status.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <IconArrowsExchange className="size-5 text-blue-600" />
          <h3 className="text-lg font-semibold">
            Transaction History
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filtered.length} records)
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="transaction-search"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-8 w-full sm:w-56"
            />
          </div>
          <ExportButton
            fileName="transaction-history"
            title="Transaction History Report"
            sheetName="Transactions"
            columns={transactionExportColumns}
            data={exportData as unknown as Record<string, unknown>[]}
          />
        </div>
      </div>

      {/* Type filter pills */}
      <div className="flex items-center gap-2">
        {(["all", "inbound", "outbound"] as TransactionType[]).map((type) => (
          <button
            key={type}
            onClick={() => {
              setTypeFilter(type);
              setCurrentPage(1);
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

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-5">
            <TableRow>
              <TableHead className="text-center w-14">No</TableHead>
              <TableHead>Transaction No.</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Handled By</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead className="text-center">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((tx, index) => (
                <TableRow key={tx.id || index}>
                  <TableCell className="text-center text-muted-foreground">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="font-medium font-mono text-sm">
                    {tx.number}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tx.type === "Inbound"
                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        : "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300"
                        }`}
                    >
                      {tx.type === "Inbound" ? (
                        <IconArrowDown className="size-3" />
                      ) : (
                        <IconArrowUp className="size-3" />
                      )}
                      {tx.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{tx.reference}</TableCell>
                  <TableCell className="text-sm">{tx.handler}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor[tx.status] ??
                        "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 ring-gray-600/20"
                        }`}
                    >
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{tx.itemCount}</TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {tx.date
                      ? new Date(tx.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  {search
                    ? `No results found for "${search}"`
                    : "No transaction data available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTabContent;