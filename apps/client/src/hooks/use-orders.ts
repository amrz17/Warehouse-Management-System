import { cancelPurchaseOrderApi, createOrderApi,  } from "@/api/purchase-order.api"
import type { OrderPayload } from "@/schemas/schema"
import { useState } from "react"

export function useOrders() {
  const [isLoading, setIsLoading] = useState(false)

  // Create Order
  const createOrder = async (payload: OrderPayload) => {
    setIsLoading(true)
    try {
      const res = await createOrderApi({
        ...payload
      })
      return res
    } catch (error: any) {
      // Tangani error spesifik dari backend
      const message = error.response?.data?.message || "Gagal membuat order"
      console.error(message)
      throw new Error(message) // Lempar ke komponen agar bisa ditangkap form
    } finally {
      setIsLoading(false)
    }
  }

  async function cancelOrder(id: string): Promise<void> {
    setIsLoading(true)
    try {
      await cancelPurchaseOrderApi(id)
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to cancel order"
      console.error(message)
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createOrder,
    isLoading,
    cancelOrder
  }
}
