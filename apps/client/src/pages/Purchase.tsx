import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DahsboardLayout from "@/layout/DashboardLayout"
import { DataTable } from "@/components/data-table"

import { columnsOrders } from "@/components/columns-purchase-order"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ResponsiveDialogDrawer } from "@/components/drawer-form"
import { OrderForm  } from "@/components/order-form"
import { fetchOrders } from "@/api/purchase-order.api"
import { toast } from "sonner"
import { useOrders } from "@/hooks/use-orders"
import { FilterIcon, PlusCircle, SearchIcon, SortAscIcon, Table } from "lucide-react"
import type { OrderPayload } from "@/schemas/schema"
import { ConfirmCancelDialog } from "@/components/dialog-cancel"
import { IconFileExport, IconPackage, IconPackageOff, IconPackages } from "@tabler/icons-react"
import { SectionCards } from "@/components/section-cards"


const PurchasePage = () => {

  const [data, setData] = useState<OrderPayload[]>([])
  const [open, setOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderPayload | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const { cancelOrder } = useOrders()

  const [openCancel, setOpenCancel] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleCancel = (id: string) => {
    setDeleteId(id)
    setOpenCancel(true)
  }

  const confirmCancel = async () => {
    if (!deleteId) return

    try {
      await cancelOrder(deleteId)
      toast.success("Order cancelled successfully")
      loadOrders()
    } catch {
      toast.error("Failed to cancel order")
    } finally {
      setOpenCancel(false)
      setDeleteId(null)
    }
  }

  // Load Orders
  const loadOrders = async () => {
    const orders = await fetchOrders()
    setData(orders)
  }

  // Initial Load
  useEffect(() => {
    loadOrders()
  }, [])

  
  return (
    <DahsboardLayout>
        <section className="flex flex-1 flex-col mt-4">
        {/* <div className="flex flex-row w-full py-6 lg:px-8">
            <div className="flex flex-1 items-center justify-between">
                <Input 
                    type="text" 
                    placeholder="Search" 
                    className="max-w-sm mx-auto lg:mr-4"
                />
            </div>
        </div> */}
        {/* <Card className="@container/card flex lg:flex-row mx-4 lg:mt-4 p-4"> */}
        <div className="flex flex-row w-full py-4 ">
            <div className="flex-1 items-center justify-start gap-3 mx-4 hidden lg:flex">
              <Button 
                size="lg"
              >
                <Table />
                Table View
              </Button>
              <Button 
                size="lg"
              >
                <FilterIcon />
                Filter
              </Button>
              <Button 
                size="lg"
              >
                <SortAscIcon />
                Sort
              </Button>
              </div>
            <div className="flex flex-1 items-center justify-end gap-4 mx-4">
              <Button 
                className="hidden lg:flex"
                size="lg"
              >
                <IconFileExport />
                Export
              </Button>
              <Button 
                className="w-full lg:w-fit"
                size="lg"
                onClick={() => {
                  setMode("create")
                  setSelectedOrder(null)
                  setOpen(true)
                }}
              >
                <PlusCircle />
                Add New Purchase Order
              </Button>
              </div>
        </div>

        <div className="flex lg:flex-row">
            {/* <div className="lg:w-3/4">
                <CardHeader>
                  <CardDescription className="text-xl w-full lg:text-3xl font-extrabold">
                    Purchase Order
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex-col items-start lg:gap-1.5 text-sm">
                      Create your purchase order by adding supplier information, selecting products, and setting quantities. Easily manage and track every order from here
                </CardFooter>
            </div> */}
            <div className="flex lg:w-1/4 items-center justify-end">
              <ResponsiveDialogDrawer
                open={open}
                onOpenChange={setOpen}
                // trigger={
                //   <Button 
                //     className="w-full mx-auto lg:ml-4"
                //     size="lg"
                //     onClick={() => {
                //       setMode("create")
                //       setSelectedOrder(null)
                //       setOpen(true)
                //     }}
                //   >
                //     <PlusCircle />
                //     Create New Purchase Order
                //   </Button>
                // }
                title={
                  mode === "create"
                    ? "Create New Purchase Order"
                    : "Edit Purchase Order"
                }
                // description={
                //   mode === "create"
                //     ? "This form is to create a new purchase order."
                //     : "Update the selected purchase order."
                // }
              >
                <OrderForm
                  mode={mode}
                  orderId={selectedOrder ? selectedOrder.id_po : undefined}
                  initialData={selectedOrder}
                  onSuccess={() => {
                    loadOrders()
                    setOpen(false)
                  }}
                />

              </ResponsiveDialogDrawer>

            </div>
        </div>
        <div className="w-full flex-col justify-start gap-6"> 
            <DataTable 
              columns={columnsOrders(handleCancel)} 
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

export default PurchasePage