import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DahsboardLayout from "@/layout/DashboardLayout"
import { DataTable } from "@/components/data-table"

import { columnsOrders } from "@/components/columns-purchase-order"
import { useEffect, useState } from "react"
import { ResponsiveDialogDrawer } from "@/components/drawer-form"
import { OrderForm  } from "@/components/order-form"
import { fetchOrders } from "@/api/purchase-order.api"
import { toast } from "sonner"
import { useOrders } from "@/hooks/use-orders"
import { FilterIcon, PlusCircle, Settings2, SortAscIcon, Table } from "lucide-react"
import type { OrderPayload } from "@/schemas/schema"
import { IconPackage } from "@tabler/icons-react"
import { ConfirmDialog } from "@/components/dialog-confirm"
import { ExportButton } from "@/components/export-button"
import type { ExportColumn } from "@/lib/export-utils"

const purchaseExportColumns: ExportColumn[] = [
  { header: "No", accessor: "_rowNum" },
  { header: "Supplier", accessor: "_supplierName" },
  { header: "PO Number", accessor: "po_number" },
  { header: "Items", accessor: "_itemNames" },
  { header: "Qty Ordered", accessor: "_qtyOrdered" },
  { header: "Qty Received", accessor: "_qtyReceived" },
  { header: "Total Price", accessor: "_totalPrice" },
  { header: "Date PO", accessor: "_date" },
  { header: "Status", accessor: "po_status" },
  { header: "Updated At", accessor: "_lastUpdate" },
];
const PurchasePage = () => {

  const [data, setData] = useState<OrderPayload[]>([])
  const [open, setOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderPayload | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const { cancelOrder } = useOrders()
  const [receivedToday, setReceivedToday] = useState(0)
  const [overdueOrders, setOverdueOrders] = useState(0)
  const [waitingApproval, setWaitingApproval] = useState(0)

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
    const today = new Date()
    const orders = await fetchOrders()
    setData(orders)
    const recivedToday = orders.filter(order => {
      const orderDate = new Date(order.expected_delivery_date)
      return orderDate.toDateString() === today.toDateString()
    })
    setReceivedToday(recivedToday.length)
    const overdue = orders.filter(order => {
      const orderDate = new Date(order.expected_delivery_date)
      return orderDate < today && order.po_status !== "CANCELLED"
    })
    setOverdueOrders(overdue.length)
    const waiting = orders.filter(order => order.po_status === "PENDING")
    setWaitingApproval(waiting.length)
  }

  // Initial Load
  useEffect(() => {
    loadOrders()
  }, [])

  const exportData = data.map((order, index) => {
    const items = order.items || [];
    return {
      ...order,
      _rowNum: index + 1,
      _supplierName: order.supplier?.name || "-",
      _itemNames: items.map(i => i.item?.name || "Unknown").join(", "),
      _qtyOrdered: items.map(i => i.qty_ordered).join(", "),
      _qtyReceived: items.map(i => i.qty_received).join(", "),
      _totalPrice: items.map(i => i.total_price).join(", "),
      _date: order.expected_delivery_date
        ? new Date(order.expected_delivery_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "-",
      _lastUpdate: order.last_update
        ? new Date(order.last_update).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "-",
    };
  });
  
  return (
    <DahsboardLayout>

        <section className="flex flex-1 flex-col mt-4">

          <div className="grid lg:grid-cols-3 gap-4 @xl/main:grid-cols-2 mx-4">
            <Card className="@container/card p-4">
              <CardHeader>
                <CardAction>
                  <IconPackage />
                </CardAction>
                <CardDescription>Received Today</CardDescription>
                {/* <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> */}
                  {/* <ProductCountCard /> */}
                {/* </CardTitle> */}
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {receivedToday}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                  This shows the volume of goods coming into the warehouse today so that the operational team knows the workload of receiving goods.
                </div>
              </CardFooter>
            </Card>
            <Card className="@container/card p-4">
              <CardHeader>
                <CardAction>
                  <IconPackage />
                </CardAction>
                <CardDescription>Overdue / Delayed Orders</CardDescription>
                {/* <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> */}
                  {/* <ProductCountCard /> */}
                {/* </CardTitle> */}
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {overdueOrders}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                  The number of Purchase Orders (POs) that have passed the vendor's delivery date. This is important to anticipate out-of-stock situations.
                </div>
              </CardFooter>
            </Card>
            <Card className="@container/card p-4">
              <CardHeader>
                <CardAction>
                  <IconPackage />
                </CardAction>
                <CardDescription>Waiting for Approval</CardDescription>
                {/* <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> */}
                  {/* <ProductCountCard /> */}
                {/* </CardTitle> */}
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {waitingApproval}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                  This presents an administrative bottleneck. If the PO is not promptly approved, the goods will not be shipped, further disrupting the sales chain.
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="flex flex-row w-full pt-4">
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
              <div className="mx-4">
                <Button className="item-center p-4 flex lg:hidden w-fit">
                  <Settings2 />
                  Action
                </Button>
              </div>
              <div className="flex flex-1 items-center justify-end gap-4 mx-4">
              <ExportButton
                fileName="purchase-orders"
                title="Purchase Orders Report"
                sheetName="Purchase Orders"
                columns={purchaseExportColumns}
                data={exportData as unknown as Record<string, unknown>[]}
              />
                <Button 
                  className="item-center p-4 w-fit"
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

          <div className="w-full flex-col justify-start gap-6"> 
              <DataTable 
                columns={columnsOrders(handleCancel)} 
                data={data} 
              />
              <ConfirmDialog 
                open={openCancel}
                onOpenChange={setOpenCancel}
                onConfirm={confirmCancel}
                title="Cancel Purchase Order"
                description="This action cannot be undone. This will permanently cancel the order."
                confirmLabel="Yes, Cancel Order"
                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
              />
          </div>

        </section>
    </DahsboardLayout>
  )
}

export default PurchasePage