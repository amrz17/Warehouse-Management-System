import { useEffect, useState } from "react";
import { fetchInventory } from "@/api/inventory.api";
import { ExportButton } from "@/components/export-button";
import type { ExportColumn } from "@/lib/export-utils";
import type { InventoryPayload } from "@/schemas/schema";
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
import { IconSearch, IconPackage, IconLoader2 } from "@tabler/icons-react";

const stockExportColumns: ExportColumn[] = [
  { header: "No", accessor: "_rowNum" },
  { header: "Item Name", accessor: "item.name" },
  { header: "Location (Bin)", accessor: "location.bin_code" },
  { header: "Qty Available", accessor: "qty_available" },
  { header: "Qty Ordered", accessor: "qty_ordered" },
  { header: "Qty Reserved", accessor: "qty_reserved" },
  { header: "Last Updated", accessor: "_lastUpdate" },
];

const StockTabContent = () => {
  const [inventory, setInventory] = useState<InventoryPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  // Filter by search
  const filtered = inventory.filter((item) => {
    const term = search.toLowerCase();
    return (
      (item.item?.name?.toLowerCase().includes(term) ?? false) ||
      (item.location?.bin_code?.toLowerCase().includes(term) ?? false)
    );
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Prepare export data with row numbers and formatted dates
  const exportData = filtered.map((item, index) => ({
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

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <IconPackage className="size-5 text-green-600" />
          <h3 className="text-lg font-semibold">
            Stock Report
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filtered.length} items)
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="stock-search"
              placeholder="Search item or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-8 w-full sm:w-64"
            />
          </div>
          <ExportButton
            fileName="stock-report"
            title="Stock Report"
            sheetName="Stock"
            columns={stockExportColumns}
            data={exportData as unknown as Record<string, unknown>[]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-5">
            <TableRow>
              <TableHead className="text-center w-14">No</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead className="text-center">Location</TableHead>
              <TableHead className="text-center">Qty Available</TableHead>
              <TableHead className="text-center">Qty Ordered</TableHead>
              <TableHead className="text-center">Qty Reserved</TableHead>
              <TableHead className="text-center">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length > 0 ? (
              paginated.map((item, index) => (
                <TableRow key={item.id_inventory ?? index}>
                  <TableCell className="text-center text-muted-foreground">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.item?.name ?? "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-300/20">
                      {item.location?.bin_code ?? "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`font-semibold ${
                        (item.qty_available ?? 0) <= 0
                          ? "text-red-600"
                          : (item.qty_available ?? 0) < 10
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.qty_available ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.qty_ordered ?? 0}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.qty_reserved ?? 0}
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {item.last_update
                      ? new Date(item.last_update).toLocaleDateString("en-US", {
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
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {search ? `No results found for "${search}"` : "No stock data available."}
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

export default StockTabContent;