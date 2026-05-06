import type { OutboundPayload, ShipOutboundPayload } from "@/schemas/schema";
import api from "./axios";

export const fetchOutbound = async (): Promise<OutboundPayload[]> => {
    const res = await api.get("/outbound");
    console.log("Outbounds: ", res.data.outbounds);
    return res.data.outbounds;
}

export const createOutboundApi = (
    payload: OutboundPayload
): Promise<OutboundPayload> => api.post("/outbound", payload) 

export const shipOutboundApi = (
    id: string,
    payload: ShipOutboundPayload 
): Promise<void> => api.patch(`/outbound/${id}/ship`, payload);

export const completeOutboundApi = (
    id: string
): Promise<void> => api.patch(`/outbound/${id}/complete`);

export const cancelOutboundApi = (
    id: string
): Promise<void> => api.post(`/outbound/cancel/${id}`);