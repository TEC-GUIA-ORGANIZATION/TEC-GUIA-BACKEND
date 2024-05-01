const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AsistenteAdminsitrador = require('./asistenteAdministradorModel.js')

const usuarioSchema = new Schema({
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
        type: String,
        enum: ['Cartago', 'San Jose', 'San Carlos', 'Alajuela', 'Limon'],
        required: true
    },
    fotografia: {
        type: String,
        required: false
    },
    rol: {
        type: String,
        required: true
    },
    adminInfo: {
        type: Schema.Types.ObjectId,
        ref: 'AsistenteAdministrador',
        required:false
    },
    profesorGuiaInfo: {
        type: Schema.Types.ObjectId,
        ref: 'ProfesorGuia',
        required:false
    }
})





const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;