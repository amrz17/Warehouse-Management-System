import api from "./axios"
import type { OrderPayload } from "@/schemas/schema"

// Get All Orders
export const fetchOrders = async (): Promise<OrderPayload[]> => {
  const response = await api.get("/purchase-order")
  return response.data.orders
}

// Create Order
export const createOrderApi = (
  payload: OrderPayload
): Promise<OrderPayload> => api.post("/purchase-order", payload)

// Cancel Purchase Order
export const cancelPurchaseOrderApi = (
  id: string,
): Promise<void> => api.post(`/purchase-order/cancel/${id}`)