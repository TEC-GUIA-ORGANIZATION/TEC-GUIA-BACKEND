import { IActivity } from "./activities.model"

export interface VisitorMensajes {
    visitar(activities: IActivity): void;
}
