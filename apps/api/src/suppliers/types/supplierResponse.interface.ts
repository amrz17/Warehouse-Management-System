import { ISupplier } from "./supplier.type";

export interface ISupplierResponse {
    success?: boolean;
    message?: string;
    supplier?: ISupplier | ISupplier[];
}