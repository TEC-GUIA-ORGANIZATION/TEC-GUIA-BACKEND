import { VisitorMensajes } from "./IVisitorMensajes";


export interface Element {
    acceptVisitorRecordatorio(visitanteRecordatorio: VisitorMensajes): void;
    acceptVisitorPublicacion(visitantePublicacion: VisitorMensajes): void;
}