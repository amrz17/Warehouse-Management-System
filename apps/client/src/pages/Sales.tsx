import { approveSaleOrderApi, cancelSaleOrderApi, completeSaleOrderApi, fetchSaleOrders } from "@/api/sale-order.api"
import { columnsSaleOrders } from "@/components/columns-sale-order";
import { DataTable } from "@/components/data-table";
import { ConfirmDialog } from "@/components/dialog-confirm";
import { ResponsiveDialogDrawer } from "@/components/drawer-form";
import { SaleForm } from "@/components/sale-form";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DahsboardLayout from "@/layout/DashboardLayout"
import type { SaleOrderPayload } from "@/schemas/schema";
import { IconPackage } from "@tabler/icons-react";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function SalesPage() {
  const [data, setData] = useState<SaleOrderPayload[]>([]);
  const [openCancel, setOpenCancel] = useState(false)
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [openApprove, setOpenApprove] = useState(false)
  const [approveId, setApproveId] = useState<string | null>(null)
  const [mode, setMode] = useState<"create" | "edit">("create")
  const [open, setOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<SaleOrderPayload | null>(null)
  const [shippingToday, setShippingToday] = useState(0)
  const [orderToShipRatio, setOrderToShipRatio] = useState(0)
  const [openComplete, setOpenComplete] = useState(false)
  const [completeId, setCompleteId] = useState<string | null>(null)
  // const [avgPackingTime, setAvgPackingTime] = useState(0)

  const fetchDataSales = async () => {
    const orders = await fetchSaleOrders();
    console.log('Sales : ', orders);
    setData(orders);
    const today = new Date();
    const shippedToday = orders.filter(order => {
      const orderDate = new Date(order.date_shipped || '');
      return orderDate.toDateString() === today.toDateString()
    })
    setShippingToday(shippedToday.length);
    const orderToShip = orders.filter(order => order.so_status === 'SHIPPED' || order.so_status === 'COMPLETED');
    setOrderToShipRatio(orderToShip.length / orders.length * 100 || 0);
    // const packingTimes = orders
    //   .filter(order => order.so_status === 'shipped' && order.verified_at && order.shipped_at)
    //   .map(order => {
    //     const verifiedTime = new Date(order.verified_at).getTime();
    //     const shippedTime = new Date(order.shipped_at).getTime();
    //     return (shippedTime - verifiedTime) / (1000 * 60); // Convert to minutes
    //   });
  }

  //
  const handleApproveOrder = (id: string) => {
    setApproveId(id)
    setOpenApprove(true)
  }

  const handleCompleteOrder = (id: string) => {
    setCompleteId(id)
    setOpenComplete(true)
  }

  const handleCancelOrder = (id: string) => {
    setCancelId(id)
    setOpenCancel(true)
  }

  // Approve Sale Order
  const confirmApprove = async () => {
    if (!approveId) return

    try {
      await approveSaleOrderApi(approveId)
      toast.success("Order approved")
      fetchDataSales()
    } catch {
      toast.error("Failed to approve order")
    } finally {
      setOpenApprove(false)
      setApproveId(null)
    }
  }

  // Complete Sale Order
  const confirmComplete = async () => {
    if (!completeId) return

    try {
      await completeSaleOrderApi(completeId)
      toast.success("Order completed")
      fetchDataSales()
    } catch {
      toast.error("Failed to complete order")
    } finally {
      setOpenComplete(false)
      setCompleteId(null)
    }
  }


  // Cancel Sale Order
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
          <div className="grid lg:grid-cols-3 gap-4 @xl/main:grid-cols-2 mt-4 mx-4">
            <Card className="@container/card p-4">
              <CardHeader>
                <CardAction>
                  <IconPackage />
                </CardAction>
                <CardDescription>Shipped Today</CardDescription>
                {/* <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> */}
                  {/* <ProductCountCard /> */}
                {/* </CardTitle> */}
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {shippingToday}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                  Displays the total quantity or value of goods that have left the warehouse and are in transit to customers today.
                </div>
              </CardFooter>
            </Card>

            <Card className="@container/card p-4">
              <CardHeader>
                <CardAction>
                  <IconPackage />
                </CardAction>
                <CardDescription>Order to Ship Ratio</CardDescription>
                {/* <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> */}
                  {/* <ProductCountCard /> */}
                {/* </CardTitle> */}
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {orderToShipRatio.toFixed(2)}%
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                  Percentage of orders received today that have been successfully shipped. Ensure there is no backlog of orders in the warehouse.
                </div>
              </CardFooter>
            </Card>

            <Card className="@container/card p-4">
              <CardHeader>
                <CardAction>
                  <IconPackage />
                </CardAction>
                <CardDescription>Avg. Packing Time</CardDescription>
                {/* <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> */}
                  {/* <ProductCountCard /> */}
                {/* </CardTitle> */}
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  0
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="text-muted-foreground">
                  Calculate the average time it takes staff from when an order is verified until the package is ready to be shipped (ready for courier pickup)
                </div>
              </CardFooter>
            </Card>
          </div>

          <Card className="@container/card mt-4 mx-4 lg:mt-4 flex lg:flex-row p-4">
            <div className="lg:w-3/4">
                <CardHeader>
                  <CardDescription className="text-xl w-full lg:text-3xl font-extrabold">
                    Sale Order
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                      Create your sale order by adding customer information, selecting products, and setting quantities.
                </CardFooter>
            </div>
            <div className="flex lg:w-1/4 items-center lg:justify-end">
                  <ResponsiveDialogDrawer
                    open={open}
                    onOpenChange={setOpen}
                    trigger={
                      <Button 
                        className="w-full lg:ml-4"
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
          </Card>
          <div className="w-full flex-col justify-start gap-6"> 
              <DataTable 
                columns={columnsSaleOrders( handleApproveOrder, handleCompleteOrder, handleCancelOrder)} 
                data={data} 
              />
              <ConfirmDialog 
                open={openApprove}
                onOpenChange={setOpenApprove}
                onConfirm={confirmApprove}
                title="Approve Sale Order"
                description="This action cannot be undone. This will permanently approve the order."
                confirmLabel="Yes, Approve Order"
                className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              />
              <ConfirmDialog 
                open={openComplete}
                onOpenChange={setOpenComplete}
                onConfirm={confirmComplete}
                title="Complete Sale Order"
                description="This action cannot be undone. This will permanently complete the order."
                confirmLabel="Yes, Complete Order"
                className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
              />
              <ConfirmDialog 
                open={openCancel}
                onOpenChange={setOpenCancel}
                onConfirm={confirmCancel}
                title="Cancel Sale Order"
                description="This action cannot be undone. This will permanently cancel the order."
                confirmLabel="Yes, Cancel Order"
                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
              />
          </div>
      </section>
    </DahsboardLayout>
  )
}