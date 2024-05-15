import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';
import { IComment, CommentsModel } from './comments.model';

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

export interface IActivity extends Document {
    week: number,
    date: Date,
    type: activityTypeEnum,
    name: string,
    desciption: string,
    responsible: [mongoose.ObjectId],
    daysToAnnounce: number,
    daysToRemember: [Date],
    modality: boolean,
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
    desciption: {
        type: String,
        required: true,
    },
    responsible: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    },
    daysToAnnounce: {
        type: Number,
        required: true,
    },
    daysToRemember: [{
        type: Date,
        required: true,
    }],
    modality: {
        type: Boolean,
        required: true,
    },
    placeLink: {
        type: String,
        required: false,
    },
    poster: {
        type: String,
        required: true,
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

