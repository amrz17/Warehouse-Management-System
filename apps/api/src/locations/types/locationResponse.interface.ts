import { ILocation } from "./location.type"

export class ILocationResponse {
    success?: boolean;
    message?: string;
    location?: ILocation | ILocation[];
}