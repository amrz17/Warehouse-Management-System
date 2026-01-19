import { SupplierEntity } from "../suppliers.entity";

export type ISupplier = Omit<SupplierEntity, 'id_supplier'>