
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//inheritance from usuarioModel 
const Usuario = require('./usuarioModel');

const profesorGuiaSchema = new Schema({
    codigo: {
        type: String,
        required: true
    },
    telegonoOficina: {
        type: String,
        required: true,
        unique: true
    },
    telefonoPersonal: {
        type: String,
        required: false,
        unique: true
    },
    esCoordinador: {
        type: Boolean,
        required: true
    },
    estaActivo: {
        type: Boolean,
        required: true
    },
})


const ProfesorGuia = mongoose.model('ProfesorGuia',profesorGuiaSchema);
module.exports = ProfesorGuia;