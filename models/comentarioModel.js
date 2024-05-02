const mongoose = require('mongoose');
const Schema = mongoose.Schema

const comentarioSchema = new Schema({
    fechaHora: {
        type: Date,
        required: true
    },
    autor: {
        type:Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    respuestas: {
        type: [this],
        required: false
    },
})


const Comentario = mongoose.model('Comentario',comentarioSchema);
module.exports = Comentario;