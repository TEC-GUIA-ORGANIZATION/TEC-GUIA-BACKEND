export interface Subscriber {
    update(contexto: any): void;
}

export interface Publisher {
    subscribe(subscriber: Subscriber): void;
    unsubscribe(subscriber: Subscriber): void;
    notifySubscribers(): void;
}
