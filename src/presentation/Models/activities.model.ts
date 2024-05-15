import mongoose from 'mongoose';
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
    activity: activityTypeEnum,
    activityName: string,
    responsible: [string],
    daysToAnnounce: number,
    daysToRemember: [Date],
    isInPerson: boolean,
    meetingLink: string,
    poster: string,
    activityStatus: string,
    evidence?: {
        attendancePhoto: String,
        participantsPhoto: String,
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
    activity:{
        type: String,
        enum: activityTypeEnum,
        required: true,
    }, 
    activityName: {
        type: String,
        required: true,
    },
    responsible: {
        type: [String],
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
    isInPerson: {
        type: Boolean,
        required: true,
    },
    meetingLink: {
        type: String,
        required: false,
    },
    poster: {
        type: String,
        required: true,
    },
    activityStatus: {
        type: String,
        enum: activityStatusEnum,
        default: activityStatusEnum.PLANEADA,
        required: true,
    },
    evidence: {
        type: {
            attendancePhoto: String,
            participantsPhoto: String,
            recordingLink: String
        },
        required: true,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }]
});

export const ActivityModel = mongoose.model('Actividades', activitySchema);

