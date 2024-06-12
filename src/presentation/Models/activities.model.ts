import mongoose from 'mongoose';
import { IComment } from './comments.model';

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
    comments?: IComment[]
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
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }]
});

export const ActivityModel = mongoose.model('Actividades', activitySchema);

