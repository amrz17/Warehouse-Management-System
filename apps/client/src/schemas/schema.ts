// schemas/order.schema.ts
import { z } from "zod"

export const orderSchema = z.object({
  po_code: z.string().min(1, "PO Code is required"),
  id_user: z.string().min(1, "Company is required"),
  date_po: z.string().min(1, "Date is required"),
  po_status: z.string().min(1, "Status is required"),
  note: z.string().optional(),
})

export type OrderPayload = z.infer<typeof orderSchema>

export const itemSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Item name is required"),
  price: z.number().min(1, "Price item is required"),
})

export type ItemPayload = z.infer<typeof itemSchema>

export const inventorySchema = z.object({
  qty_available: z.number().min(1, "Quantity is required"),
  qty_reserved: z.number(),
  id_item: z.string().min(1, "ID Item is requeired"),
  id_location: z.string().min(1, "ID location is required")
})

export type InventoryPayload = z.infer<typeof inventorySchema>

export const locationSchema = z.object({
  bin_code: z.string().min(1, "Bin code is required"),
  description: z.string()
})

export type LocationPayload = z.infer<typeof locationSchema>
