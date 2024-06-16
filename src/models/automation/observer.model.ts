// observer.model.ts

import { IActivity } from "../activity.model";

export interface Subscriber {
    update(contexto: IActivity): void;
}

export interface Publisher {
    subscribe(subscriber: Subscriber): void;
    unsubscribe(subscriber: Subscriber): void;
    notifySubscribers(): void;
}
