import mongoose from "mongoose";

export interface IComment {
    activityID: mongoose.Types.ObjectId,
    professor: string,
    message: string,
    timestamp: Date,
    parentID?: mongoose.Types.ObjectId,
    children: mongoose.Types.ObjectId[]
}

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

export const CommentsModel = mongoose.model('Comments', commentSchema);