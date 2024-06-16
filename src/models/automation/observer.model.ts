// observer.model.ts

import { IActivity } from "../activity.model";

export interface Subscriber {
    updatePublication(contexto: IActivity): void;
    updateReminder(contexto: IActivity): void;
}

export interface Publisher {
    subscribe(subscriber: Subscriber): void;
    unsubscribe(subscriber: Subscriber): void;
    notifyReminderSubscribers(): void;
    notifyPublicationSubscribers(): void;
}
