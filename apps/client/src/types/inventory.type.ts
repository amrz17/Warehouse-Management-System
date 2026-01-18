
export type InventoryOrder = {
    id_inventory: string
    id_item: string
    id_location: string
    qty_available: number
    qty_reserved: number
    last_update: string
    created_at: string
}