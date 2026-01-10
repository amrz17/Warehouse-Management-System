import type { PurchaseOrder } from "@/components/columns"
import api from "./axios"
import type { OrderPayload } from "@/schemas/order.schema"

// Get All Orders
export const fetchOrders = async (): Promise<PurchaseOrder[]> => {
  const response = await api.get("/order")
  return response.data.orders
}

// Create Order
export const createOrderApi = (
  payload: OrderPayload
): Promise<PurchaseOrder> => api.post("/order", payload)

// Update Order
export const updateOrderApi = (id: string, 
  payload: OrderPayload
): Promise<PurchaseOrder> => api.put(`/order/update/${id}`, payload)

// Delete Order
export const deleteOrderApi = (
  id: string,
): Promise<void> => api.delete(`/order/delete/${id}`)