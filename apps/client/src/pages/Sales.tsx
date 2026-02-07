import { cancelSaleOrderApi, fetchSaleOrders } from "@/api/sale-order.api"
import { columnsSaleOrders } from "@/components/columns-sale-order";
import { DataTable } from "@/components/data-table";
import { ConfirmCancelDialog } from "@/components/dialog-cancel";
import { ResponsiveDialogDrawer } from "@/components/drawer-form";
import { SaleForm } from "@/components/sale-form";
import { Button } from "@/components/ui/button";
import DahsboardLayout from "@/layout/DashboardLayout"
import type { SaleOrderPayload } from "@/schemas/schema";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


// TODO : Fix responsive issue
export default function SalesPage() {
  const [data, setData] = useState<SaleOrderPayload[]>([]);
  const [openCancel, setOpenCancel] = useState(false)
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const [open, setOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<SaleOrderPayload | null>(null)

  const fetchDataSales = async () => {
    const orders = await fetchSaleOrders();
    console.log(orders);
    setData(orders);
  }

  //
  const handleCancelOrder = (id: string) => {
    setCancelId(id)
    setOpenCancel(true)
  }

  // 
  const confirmCancel = async () => {
    if (!cancelId) return

    try {
      await cancelSaleOrderApi(cancelId)
      toast.success("Order cancelled")
      fetchDataSales()
    } catch {
      toast.error("Failed to cancel order")
    } finally {
      setOpenCancel(false)
      setCancelId(null)
    }
  }

  useEffect(() => {
    fetchDataSales();
  }, []);

  return (
    <DahsboardLayout>
        <section className="flex flex-1 flex-col">
        <div className="flex w-1/4 items-center justify-end">
              <ResponsiveDialogDrawer
                open={open}
                onOpenChange={setOpen}
                trigger={
                  <Button 
                    className="flex flex-1 ml-4 mt-4"
                    onClick={() => {
                      setMode("create")
                      setSelectedSale(null)
                      setOpen(true)
                    }}
                  >
                    <PlusCircle />
                    Create New Sale Order
                  </Button>
                }
                title={
                  mode === "create"
                    ? "Create New Sale Order"
                    : "Edit Sale Order"
                }
                // description={
                //   mode === "create"
                //     ? "This form is to create a new sale order."
                //     : "Update the selected sale order."
                // }
              >
                  <SaleForm
                    mode={mode}
                    orderId={selectedSale ? selectedSale.id_so : undefined}
                    initialData={selectedSale}
                    onSuccess={() => {
                      fetchDataSales()
                      setOpen(false)
                    }}
                />

              </ResponsiveDialogDrawer>

        </div>
        <div className="w-full flex-col justify-start gap-6"> 
            <DataTable 
              columns={columnsSaleOrders(handleCancelOrder)} 
              data={data} 
            />
            <ConfirmCancelDialog
              open={openCancel}
              onOpenChange={setOpenCancel}
              onConfirm={confirmCancel}
            />
        </div>
      </section>
    </DahsboardLayout>
  )
}