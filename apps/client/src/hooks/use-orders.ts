import { createOrderApi, deleteOrderApi, updateOrderApi } from "@/api/order.api"
import type { OrderPayload } from "@/schemas/order.schema"
import { useState } from "react"

export function useOrders() {
  const [isLoading, setIsLoading] = useState(false)

  // Create Order
  const createOrder = async (payload: OrderPayload) => {
    setIsLoading(true)
    try {
      const res = await createOrderApi({
        po_code: payload.po_code,
        id_user: payload.id_user,
        date_po: payload.date_po,
        po_status: payload.po_status,
        note: payload.note,
      })
      return res
    } finally {
      setIsLoading(false)
    }
  }

  // Update Order
  const updateOrder = async (id: string, payload: OrderPayload) => {
    setIsLoading(true)
    try {
      const res = await updateOrderApi(id, {
        po_code: payload.po_code,
        id_user: payload.id_user,
        date_po: payload.date_po,
        po_status: payload.po_status,
        note: payload.note,
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
