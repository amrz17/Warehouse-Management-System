import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import DahsboardLayout from "@/layout/DashboardLayout"
import { DataTable } from "@/components/data-table"

import { columnsOrders, type PurchaseOrder  } from "@/components/columns"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ResponsiveDialogDrawer } from "@/components/drawer-form"
import { OrderForm  } from "@/components/order-form"
import { fetchOrders } from "@/api/order.api"
import { toast } from "sonner"
import { useOrders } from "@/hooks/use-orders"
import { ConfirmDeleteDialog } from "@/components/dialog-delete"
import { PlusCircle } from "lucide-react"
// import { Separator } from "@radix-ui/react-dropdown-menu"


const Orders = () => {

  const [data, setData] = useState<PurchaseOrder[]>([])
  const [open, setOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const { deleteOrder } = useOrders()

  const [openDelete, setOpenDelete] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setOpenDelete(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      await deleteOrder(deleteId)
      toast.success("Order deleted")
      loadOrders()
    } catch {
      toast.error("Failed to delete order")
    } finally {
      setOpenDelete(false)
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

  // Handle Edit Order
  const handleEdit = (order: PurchaseOrder) => {
    setMode("edit")
    setSelectedOrder(order)
    setOpen(true)
  }

  return (
    <DahsboardLayout>
        <section className="flex flex-1 flex-col">
        <div className="flex flex-row w-full py-6 px-8">
            <div>
                {/* <h1 className="text-5xl font-semibold">Orders</h1> */}
            </div>
            <div className="flex flex-1 items-center justify-between">
                <Input 
                    type="text" 
                    placeholder="Search" 
                    className="max-w-sm mr-4"
                />
            </div>
        </div>
        <Card className="@container/card mx-4 mt-4 flex flex-row p-4">
            <div className="w-3/4">
                <CardHeader>
                  <CardDescription className="text-3xl font-extrabold">Create Your First Order</CardDescription>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="">
                      Create your first order by adding customer information, selecting products, and setting quantities. Easily manage and track every order from here
                    </div>
                </CardFooter>
            </div>
            <div className="flex w-1/4 items-center justify-end">
              <ResponsiveDialogDrawer
                open={open}
                onOpenChange={setOpen}
                trigger={
                  <Button 
                    className="ml-4"
                    onClick={() => {
                      setMode("create")
                      setSelectedOrder(null)
                      setOpen(true)
                    }}
                  >
                    <PlusCircle />
                    Create New Sales Order
                  </Button>
                }
                title={
                  mode === "create"
                    ? "Create New Sales Order"
                    : "Edit Sales Order"
                }
                description={
                  mode === "create"
                    ? "This form is to create a new sales order."
                    : "Update the selected sales order."
                }
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
        </Card>
        <div className="w-full flex-col justify-start gap-6"> 
            <DataTable 
              columns={columnsOrders(handleEdit, handleDelete)} 
              data={data} 
            />
            <ConfirmDeleteDialog
              open={openDelete}
              onOpenChange={setOpenDelete}
              onConfirm={confirmDelete}
            />
        </div>
        </section>
    </DahsboardLayout>
  )
}

export default Orders