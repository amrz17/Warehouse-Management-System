import type { InboundPayload } from "@/schemas/schema";
import api from "./axios";

// Get All Inbound Shipments
export const fetchInbound = async (): Promise<InboundPayload[]> => {
    const res = await api.get("/inbound");
    console.log("Inbounds: ", res.data.inbounds);
    return res.data.inbounds;
}

// Create Inbound Shipment
export const createInboundApi = (
    payload: InboundPayload
): Promise<InboundPayload> => api.post("/inbound", payload);

// Complete Inbound Shipment
export const completeInboundApi = (
    id: string,
): Promise<void> => api.patch(`/inbound/${id}/complete`);

// Cancel Inbound Shipment
export const cancelInboundApi = (
    id: string,
): Promise<void> => api.post(`/inbound/cancel/${id}`);

