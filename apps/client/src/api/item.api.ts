import type { ItemPayload } from "@/schemas/order.schema"
import api from "./axios"
import type { ItemsOrder } from "@/types/item.type"

export const fetchItems = async (): Promise<any> => {
    const response = await api.get("/items")

    return response.data.items
}

export const createItemApi = (
    payload: ItemPayload
): Promise<ItemsOrder> => api.post("/items", payload) 

export const updateItemApi = (
    id: string,
    payload: ItemPayload
): Promise<ItemsOrder> => api.put(`/items/update/${id}`, payload) 

export const deleteItemApi = (
    id: string
): Promise<void> => api.delete(`/items/delete/${id}`)