import { Publisher } from "../presentation/Models/IPublisher";
import { Suscriptor } from "../presentation/Models/ISuscriptor";
import { IActivity } from "../presentation/Models/activities.model";

class VisitorPublicacionActividad implements Publisher {
    private suscriptores: Suscriptor[] = [];

    visitar(actividad: IActivity): void {

    }

    suscribir(suscriptor: Suscriptor): void {
        this.suscriptores.push(suscriptor);
    }

    desuscribir(suscriptor: Suscriptor): void {
        this.suscriptores = this.suscriptores.filter(s => s !== suscriptor);
    }

    notificarSuscriptores(): void {
        this.suscriptores.forEach(s => s.update(this));
    }
}