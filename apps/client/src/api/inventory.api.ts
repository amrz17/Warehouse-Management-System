import type { InventoryPayload } from "@/schemas/schema"
import api from "./axios"

export const fetchInventory = async (): Promise<any> => {
    const res = await api.get("/inventory")

    console.log("API Response:", res.data.inventory); // Debugging line
    return res.data.inventory
}

export const createInventoryApi = (
    payload: InventoryPayload
): Promise<any> => api.post("/inventory", payload)

export const updateInventoryApi = (
    id: string,
    payload: InventoryPayload
): Promise<any> => api.put(`/inventory/update/${id}`, payload)

export const deleteInventoryApi = (
    id: string
): Promise<any> => api.delete(`/inventory/delete/${id}`)


