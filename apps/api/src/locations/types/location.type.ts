import { LocationEntity } from "../locations.entity";

export type ILocation = Omit<LocationEntity, 'id_location'>