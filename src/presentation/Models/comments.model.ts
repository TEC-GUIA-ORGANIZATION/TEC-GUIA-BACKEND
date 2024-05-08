import mongoose from "mongoose"

const comentarioSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    answer: {
        type: [this],
        required: false
    },
})


export const CommentsModel = mongoose.model('Comentarios', comentarioSchema);
