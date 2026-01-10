import { IOrder } from "./order.type";

export class IOrdersResponse {
    success?: boolean;
    message?: string;
    orders?: IOrder | IOrder[];
}