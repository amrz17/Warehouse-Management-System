// schemas/order.schema.ts
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
  id_so: z.string().optional(),
  so_number: z.string().optional().or(z.literal("")),
  id_user: z.string().min(1, "User ID is required"),
  createdBy: z.object({
    name: z.string().optional()
  }).optional(),
  id_customer: z.string().min(1, "Customer ID is required"),
  customer: z.object({
    name: z.string().optional()
  }).optional(),
  so_status: z.string().min(1, "Status is required"),
  date_shipped: z.string().optional().or(z.literal("")),
  note: z.string().optional(),
  items: z.array(
    z.object({
      id_item: z.string().min(1, "Item ID is required"),
      qty_ordered: z.number().min(1, "Quantity must be at least 1"),
      qty_shipped: z.number().optional(),
      price_per_unit: z.number().min(0, "Price must be at least 0"),
      item: z.object({
        name: z.string().optional()
      }).optional(),
    }),
  )
})

export type SaleOrderPayload = z.infer<typeof saleOrderSchema>

// Item Schema
export const itemSchema = z.object({
  id_item: z.string().optional(),
  item: z.object({
    name: z.string().optional()
  }).optional(),
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
  id_user: z.string().optional(),
  createdBy: z.object({
    name: z.string().optional()
  }).optional(),
  id_item: z.string().min(1, "ID Item is requeired"),
  item: z.object({
    name: z.string().optional()
  }).optional(),
  id_location: z.string().min(1, "ID location is required"),
  location: z.object({
    bin_code: z.string().optional()
  }).optional(),
  qty_available: z.number().min(1, "Quantity is required"),
  qty_ordered: z.number().optional(),
  qty_reserved: z.number().optional(),
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

// Inbound Schema
export const inboundSchema = z.object({
  id_inbound: z.string().optional(),
  inbound_number: z.string().optional(),
  id_po: z.string().min(1, "Purchase Order ID is required"),
  purchaseOrder: z.object({
    po_number: z.string().optional()
  }).optional(),
  id_user: z.string().min(1, "User ID is required"),
  receivedBy: z.object({
    name: z.string().optional()
  }).optional(),
  id_supplier: z.string().min(1, "Supplier ID is required"),
  supplierName: z.object({
    name: z.string().optional()
  }).optional(),
  received_at: z.string().min(1, "Received date is required"),
  status_inbound: z.enum(['CANCELED', 'DRAFT', 'PARTIAL', 'RECEIVED']).optional(),
  note: z.string().optional(),
  items: z.array(
    z.object({
      id_item: z.string().min(1, "Item ID is required"),
      id_poi: z.string().min(1, "Purchase Order Item ID is required"),
      qty_received: z.number().min(1, "Quantity received must be at least 1"),
      item: z.object({
        name: z.string().optional()
      }).optional(),
    }),
  ),
  last_update: z.string().optional(),
  created_at: z.string().optional(),
})

export type InboundPayload = z.infer<typeof inboundSchema>

export const OutboundSchema = z.object({
  id_outbound: z.string().optional(),
  outbound_number: z.string().optional(),
  id_so: z.string().min(1, "Sales Order ID is required"),
  sales_order: z.object({
    so_number: z.string().optional()
  }).optional(),
  id_user: z.string().min(1, "User ID is required"),
  shipped_by: z.object({
    name: z.string().optional()
  }).optional(),
  id_customer: z.string().min(1, "Customer ID is required"),
  customer: z.object({
    customer_name: z.string().optional()
  }).optional(),
  shipped_at: z.string().min(1, "Shipped date is required"),
  carrier_name: z.string().min(1, "Carrier name is required"),
  tracking_number: z.string().min(1, "Tracking number is required"),
  status_outbound: z.enum(['CANCELED', 'OPEN', 'SHIPPED']).optional(),
  note: z.string().optional(),
  items: z.array(
    z.object({
      id_item: z.string().min(1, "Item ID is required"),
      id_soi: z.string().min(1, "Sales Order Item ID is required"),
      qty_shipped: z.number().min(1, "Quantity shipped must be at least 1"),
      item: z.object({
        name: z.string().optional()
      }).optional(),
    }),
  ),
  updated_at: z.string().optional(),
  created_at: z.string().optional(),
})

export type OutboundPayload = z.infer<typeof OutboundSchema>