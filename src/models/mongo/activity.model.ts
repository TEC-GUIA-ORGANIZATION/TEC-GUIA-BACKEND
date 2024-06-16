// activity.model.ts

import mongoose from 'mongoose';
import { ActivityModality, ActivityStatus, ActivityType, IActivity } from '../activity.model';

export interface IActivityMongo extends Document, IActivity {
}

// Activity schema 
// This schema defines the structure of an activity
const activitySchema = new mongoose.Schema<IActivityMongo>({
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
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
});

export const Activity = mongoose.model('Actividades', activitySchema);
