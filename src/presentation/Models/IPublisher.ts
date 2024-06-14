import { Suscriptor } from "./ISuscriptor";

export interface Publisher {
    suscribir(suscriptor: Suscriptor): void;
    desuscribir(suscriptor: Suscriptor): void;
    notificarSuscriptores(): void;
}