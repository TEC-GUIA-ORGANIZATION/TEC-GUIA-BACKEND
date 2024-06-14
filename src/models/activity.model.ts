// activity.model.ts

import mongoose from 'mongoose';
import { IComment } from './comment.model';

// Activity types 
// This enum contains the different types of activities that can be created
export enum ActivityType {
    ORIENTADORA = 'Orientadora',
    MOTIVACIONAL = 'Motivacional',
    APOYO_VIDA_ESTUDIANTIL = 'De apoyo a la vida estudiantil',
    ORDEN_TECNICO = 'De orden tecnico',
    RECREACION = 'De recreacion'
};

// Activity status 
// This enum contains the different statuses that an activity can have
export enum ActivityStatus {
    PLANEADA = 'PLANEADA',
    NOTIFICADA = 'NOTIFICADA',
    REALIZADA = 'REALIZADA',
    CANCELADA = 'CANCELADA',
};

// Activity modality 
// This enum contains the different modalities that an activity can have
export enum ActivityModality {
    PRESENCIAL = 'PRESENCIAL',
    REMOTA = 'REMOTA'
}

// Activity interface
// This interface defines the structure of an activity
export interface IActivity extends Document {
    week: number,
    date: Date,
    type: ActivityType,
    name: string,
    description: string,
    responsible: mongoose.ObjectId,
    daysToAnnounce: number,
    daysToRemember: number,
    modality: ActivityModality,
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

// Activity schema 
// This schema defines the structure of an activity
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
        enum: ActivityType,
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
        enum: ActivityModality,
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
        enum: ActivityStatus,
        default: ActivityStatus.PLANEADA,
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

export const Activity = mongoose.model('Actividades', activitySchema);
