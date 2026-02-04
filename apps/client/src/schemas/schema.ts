// schemas/order.schema.ts
import { Lasso, LassoSelect } from "lucide-react"
import { z } from "zod"

// Purchase Order Schema
export const orderSchema = z.object({
  id_po: z.string().optional(),
  po_number: z.string().optional(),
  id_supplier: z.string().min(1, "Supplier is required"),
  supplier: z.object({
    name: z.string().optional()
  }).optional(),
  id_user: z.string().min(1, "Company is required"),
  createdBy: z.object({
    name: z.string().optional()
  }).optional(),
  expected_delivery_date: z.string().min(1, "Date is required"),
  po_status: z.string().min(1, "Status is required"),
  note: z.string().optional(),
  items: z.array(
    z.object({
      id_item: z.string().min(1, "Item ID is required"),
      qty_ordered: z.number().min(1, "Quantity must be at least 1"),
      qty_received: z.number().optional(),
      price_per_unit: z.number().min(0, "Price must be at least 0"),
      total_price: z.number().optional(),  
      item: z.object({
        name: z.string().optional()
      }).optional()
    }),
  ),
  last_update: z.string().optional(),
  created_at: z.string().optional(),
})

export type OrderPayload = z.infer<typeof orderSchema>

// Sale Order Schema
export const saleOrderSchema = z.object({
  so_number: z.string().optional().or(z.literal("")),
  id_user: z.string().min(1, "User ID is required"),
  id_customer: z.string().min(1, "Customer ID is required"),
  so_status: z.string().min(1, "Status is required"),
  date_shipped: z.string().optional().or(z.literal("")),
  note: z.string().optional(),
  items: z.array(
    z.object({
      id_item: z.string().min(1, "Item ID is required"),
      qty_ordered: z.number().min(1, "Quantity must be at least 1"),
      price_per_unit: z.number().min(0, "Price must be at least 0"),
    }),
  )
})

export type SaleOrderPayload = z.infer<typeof saleOrderSchema>

// Item Schema
export const itemSchema = z.object({
  id_item: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  price: z.number().min(1, "Price item is required"),
  isActive: z.string().optional(),
  created_at: z.string().optional(),
})

export type ItemPayload = z.infer<typeof itemSchema>

// Inventory Schema
export const inventorySchema = z.object({
  id_inventory: z.string().optional(),
  id_item: z.string().min(1, "ID Item is requeired"),
  id_location: z.string().min(1, "ID location is required"),
  qty_available: z.number().min(1, "Quantity is required"),
  qty_reserved: z.number(),
  last_update: z.string().optional(),
  created_at: z.string().optional(),
})

export type InventoryPayload = z.infer<typeof inventorySchema>

// Location Schema
export const locationSchema = z.object({
  id_location: z.string().optional(),
  bin_code: z.string().min(1, "Bin code is required"),
  description: z.string(),
  created_at: z.string().optional()
})

export type LocationPayload = z.infer<typeof locationSchema>
