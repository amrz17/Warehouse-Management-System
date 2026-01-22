import { InboundEntity } from "../entities/inbound.entity";

export type IInbound = Omit<InboundEntity, 'id_inbound'>