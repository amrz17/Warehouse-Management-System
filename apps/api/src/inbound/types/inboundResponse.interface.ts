import { IInbound } from "./inbound.type";

export interface IInboundresponse {
    success?: boolean;
    message?: string;
    inbounds?: IInbound | IInbound[];
}