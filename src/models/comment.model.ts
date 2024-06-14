// comment.model.ts

import mongoose from "mongoose";

// Comment interface 
// This interface defines the structure of a comment
export interface IComment {
    activityID: mongoose.Types.ObjectId,
    professor: string,
    message: string,
    timestamp: Date,
    parentID?: mongoose.Types.ObjectId,
    children: mongoose.Types.ObjectId[]
}

// Comment schema 
// This schema defines the structure of a comment
const commentSchema = new mongoose.Schema<IComment>({
    activityID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actividades',
        required: true
    },
    professor: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    parentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }]
})

export const Comment = mongoose.model('Comments', commentSchema);
