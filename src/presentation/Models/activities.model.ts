import mongoose from 'mongoose';

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
    CANCELADA = 'CANCELADA'
};

interface IActivity extends Document {
    week: number,
    activity: activityTypeEnum,
    activityName: string,
    responsible: [string],
    daysToAnnounce: number,
    daysToRemember: number,
    isInPerson: boolean,
    meetingLink: string,
    poster: string,
    activityStatus: string,
    evidence?: {
        attendancePhoto: String,
        participantsPhoto: String,
        recordingLink: String
    },
}

interface ActivityDocument extends IActivity, Document {}

const activitySchema = new mongoose.Schema<ActivityDocument>({
    week: {
      type: Number,
      require: true,  
    },
    activity:{
        type: String,
        enum: activityTypeEnum,
        require: true,
    }, 
    activityName: {
        type: String,
        require: true,
    },
    responsible: {
        type: [String],
        require: true,
    },
    daysToAnnounce: {
        type: Number,
        require: true,
    },
    daysToRemember: {
        type: Number,
        require: true,
    },
    isInPerson: {
        type: Boolean,
        require: true,
    },
    meetingLink: {
        type: String,
        require: false,
    },
    poster: {
        type: String,
        require: true,
    },
    activityStatus: {
        type: String,
        enum: activityStatusEnum,
        require: true,
    },
    evidence: {
        type: {
            attendancePhoto: String,
            participantsPhoto: String,
            recordingLink: String
        },
        require: true,
    }
});

export const ActivityModel = mongoose.model('Actividades', activitySchema);

