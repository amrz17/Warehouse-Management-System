import { createOrderApi, deleteOrderApi, updateOrderApi } from "@/api/order.api"
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

  // Update Order
  const updateOrder = async (id: string, payload: OrderPayload) => {
    setIsLoading(true)
    try {
      const res = await updateOrderApi(id, {
        ...payload
      })
      return res
    } finally {
      setIsLoading(false)
    }
  }

  // Delete Order
  const deleteOrder = async (id: string) => {
    setIsLoading(true)
    try {
      await deleteOrderApi(id)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createOrder,
    updateOrder,
    deleteOrder,
    isLoading,
  }
}
