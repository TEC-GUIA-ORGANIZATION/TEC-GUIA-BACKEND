import mongoose, { Document } from 'mongoose';
import { IComment } from './comments.model';
import { Suscriptor } from './ISuscriptor';
import { VisitorMensajes } from './IVisitorMensajes';

export enum activityTypeEnum {
    ORIENTADORA = 'Orientadora',
    MOTIVACIONAL = 'Motivacional',
    APOYO_VIDA_ESTUDIANTIL = 'De apoyo a la vida estudiantil',
    ORDEN_TECNICO = 'De orden tecnico',
    RECREACION = 'De recreacion'
};

export enum activityStatusEnum {
    PLANEADA = 'PLANEADA',
    NOTIFICADA = 'NOTIFICADA',
    REALIZADA = 'REALIZADA',
    CANCELADA = 'CANCELADA',
    PUBLICADA = 'PUBLICADA'
};

export enum activityModalityEnum {
    PRESENCIAL = 'PRESENCIAL',
    REMOTA = 'REMOTA'
}

export interface IActivity extends Document {
    week: number,
    date: Date,
    type: activityTypeEnum,
    name: string,
    description: string,
    responsible: mongoose.ObjectId,
    daysToAnnounce: number,
    daysToRemember: number,
    modality: activityModalityEnum,
    placeLink: string,
    poster: string,
    status: string,
    evidence?: {
        attendance: [String],
        participants: [String],
        recordingLink: String
    },
    comments?: IComment[],
    suscriptores: Suscriptor[];

    acceptVisitorRecordatorio(visitanteRecordatorio: VisitorMensajes): void;
    acceptVisitorPublicacion(visitantePublicacion: VisitorMensajes): void;
    suscribir(suscriptor: Suscriptor): void;
    desuscribir(suscriptor: Suscriptor): void;
    notificarSuscriptores(): void;
}

const activitySchema = new mongoose.Schema<IActivity>({
    week: {
      type: Number,
      required: true,
      min: 1,     
      max: 16     
    },
    date: {
      type: Date,
      required: true,  
    },
    type:{
        type: String,
        enum: activityTypeEnum,
        required: true,
    }, 
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    responsible: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    daysToAnnounce: {
        type: Number,
        required: true,
    },
    daysToRemember: {
        type: Number,
        required: true,
    },
    modality: {
        type: String,
        enum: activityModalityEnum,
        required: true,
    },
    placeLink: {
        type: String,
        required: false,
    },
    poster: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: activityStatusEnum,
        default: activityStatusEnum.PLANEADA,
        required: true,
    },
    evidence: {
        type: {
            attendance: [String],
            participants: [String],
            recordingLink: String
        },
        required: true,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
    suscriptores: [{ 
        type: mongoose.Schema.Types.Mixed, //
        required: true,
    }]
});

activitySchema.methods.acceptVisitorRecordatorio = function(visitanteRecordatorio: VisitorMensajes): void {
    visitanteRecordatorio.visitar(this as IActivity);
}

activitySchema.methods.acceptVisitorPublicacion = function(visitantePublicacion: VisitorMensajes): void {
    visitantePublicacion.visitar(this as IActivity);
}

activitySchema.methods.suscribir = function(suscriptor: Suscriptor): void {
    this.suscriptores.push(suscriptor);
}

activitySchema.methods.desuscribir = function(suscriptor: Suscriptor): void {
    this.suscriptores = this.suscriptores.filter((s: Suscriptor) => s !== suscriptor);
}

activitySchema.methods.notificarSuscriptores = function(): void {
    this.suscriptores.forEach((s: Suscriptor) => {
        if (typeof s.update === 'function') {
            s.update(this);
        }
    });
}


export const ActivityModel = mongoose.model('Actividades', activitySchema);

