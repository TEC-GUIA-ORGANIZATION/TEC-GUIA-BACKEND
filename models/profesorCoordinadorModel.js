
const mongoose = require('mongoose')
const Sede = require('../enums/sedeEnumModel.ts');
const Schema = mongoose.Schema

const profesorCoordinadorSchema = new Schema({
    correo: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], 
    },
    contrasena: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    primerApellido: {
        type: String,
        required: true
    },
    segundoApellido: {
        type: String,
        required: true
    },
    sede: {
        type: Sede,
        required: true
    },
    fotografia: {
        type: String,
        required: true
    },
})


const profesorCoordinador = mongoose.model('Usuario', profesorCoordinador);
module.exports = profesorCoordinador;