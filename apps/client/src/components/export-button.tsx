import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDownload, IconFileSpreadsheet, IconFileTypePdf, IconLoader2 } from "@tabler/icons-react";
import {
  exportToExcel,
  exportToPDF,
  type ExportColumn,
} from "@/lib/export-utils";

interface ExportButtonProps {
  fileName: string;
  title?: string;
  sheetName?: string;
  columns: ExportColumn[];
  data: Record<string, unknown>[];
  disabled?: boolean;
}

export function ExportButton({
  fileName,
  title,
  sheetName,
  columns,
  data,
  disabled = false,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback((format: "excel" | "pdf") => {
    if (data.length === 0) return;

    setIsExporting(true);

    // Small delay so the UI updates before the synchronous export runs
    setTimeout(() => {
      try {
        const options = { fileName, title, sheetName, columns, data };

        if (format === "excel") {
          exportToExcel(options);
        } else {
          exportToPDF(options);
        }
      } catch (error) {
        console.error(`Failed to export as ${format}:`, error);
      } finally {
        setIsExporting(false);
      }
    }, 50);
  }, [data, fileName, title, sheetName, columns]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          id="export-button"
          variant="outline"
          size="sm"
          disabled={disabled || isExporting || data.length === 0}
          className="gap-2"
        >
          {isExporting ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : (
            <IconDownload className="size-4" />
          )}
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          id="export-excel-option"
          onSelect={() => handleExport("excel")}
          className="cursor-pointer gap-2"
        >
          <IconFileSpreadsheet className="size-4 text-green-600" />
          <div className="flex flex-col">
            <span className="font-medium">Excel (.xlsx)</span>
            <span className="text-xs text-muted-foreground">Spreadsheet format</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          id="export-pdf-option"
          onSelect={() => handleExport("pdf")}
          className="cursor-pointer gap-2"
        >
          <IconFileTypePdf className="size-4 text-red-600" />
          <div className="flex flex-col">
            <span className="font-medium">PDF (.pdf)</span>
            <span className="text-xs text-muted-foreground">Document format</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
