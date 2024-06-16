// activity.model.ts

import mongoose from 'mongoose';
import { IComment } from './mongo/comment.model';
import { Publisher, Subscriber } from './automation/observer.model';
import { Visitable, MessageVisitor } from './mongo/visitor.model';

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
export interface IActivity {
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
    comments?: IComment[],
}
