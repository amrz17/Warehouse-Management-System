import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportColumn {
  header: string;
  accessor: string;
}

export interface ExportOptions {
  fileName: string;
  sheetName?: string;
  title?: string;
  columns: ExportColumn[];
  data: Record<string, unknown>[];
}

/**
 * Resolve a nested accessor like "item.name" from an object.
 */
function resolveAccessor(obj: Record<string, unknown>, accessor: string): string {
  const keys = accessor.split(".");
  let value: unknown = obj;
  for (const key of keys) {
    if (value == null || typeof value !== "object") return "";
    value = (value as Record<string, unknown>)[key];
  }
  if (value == null) return "";
  return String(value);
}

/**
 * Export table data to an Excel (.xlsx) file.
 * Uses XLSX.writeFile which handles browser download internally.
 */
export function exportToExcel(options: ExportOptions): void {
  const { fileName, sheetName = "Sheet1", title, columns, data } = options;

  const headers = columns.map((col) => col.header);

  const rows = data.map((row) =>
    columns.map((col) => resolveAccessor(row, col.accessor))
  );

  const wsData: (string | number)[][] = [];

  if (title) {
    wsData.push([title]);
    wsData.push([]);
  }

  wsData.push(headers);
  wsData.push(...rows);

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Auto-size columns
  const colWidths = headers.map((header, i) => {
    const maxDataLen = rows.reduce((max, row) => {
      const cellLen = String(row[i] ?? "").length;
      return cellLen > max ? cellLen : max;
    }, header.length);
    return { wch: Math.min(maxDataLen + 4, 50) };
  });
  ws["!cols"] = colWidths;

  if (title) {
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
    ];
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // writeFile handles browser download correctly via its internal write_dl function
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

/**
 * Export table data to a PDF file with a styled table.
 * Uses jsPDF's built-in doc.save() for browser download.
 */
export function exportToPDF(options: ExportOptions): void {
  const { fileName, title, columns, data } = options;

  const doc = new jsPDF({
    orientation: data.length > 0 && columns.length > 5 ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  if (title) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(`Generated: ${dateStr}`, pageWidth / 2, 22, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  const head = [columns.map((col) => col.header)];

  const body = data.map((row) =>
    columns.map((col) => resolveAccessor(row, col.accessor))
  );

  autoTable(doc, {
    startY: title ? 28 : 15,
    head,
    body,
    theme: "grid",
    headStyles: {
      fillColor: [34, 139, 34],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8,
      halign: "center",
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.25,
      overflow: "linebreak",
    },
    margin: { top: 10, left: 10, right: 10 },
    didDrawPage: (pageData) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${pageData.pageNumber} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    },
  });

  // save() handles browser download via its own internal mechanism
  doc.save(`${fileName}.pdf`);
}
