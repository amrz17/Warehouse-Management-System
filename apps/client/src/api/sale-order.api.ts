import type { SaleOrderPayload } from "@/schemas/schema";
import api from "./axios";

// Get All Sale Orders
export const fetchSaleOrders = async (): Promise<SaleOrderPayload[]> => {
    const response = await api.get("/sale-order");
    console.log("Sales: ", response.data.saleOrders);
    return response.data.sales;
}

//  Create Sale Order
export const createSaleOrderApi = (
    payload: SaleOrderPayload
): Promise<SaleOrderPayload> => api.post("/sale-order", payload);

// Cancel Sale Order
export const cancelSaleOrderApi = (
    id: string,
): Promise<void> => api.post(`/sale-order/cancel/${id}`);


