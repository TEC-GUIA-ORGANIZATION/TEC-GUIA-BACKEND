
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const  asistenteAdministradorSchema = new Schema({
    esPrincipal: {
        type: Boolean,
        required: true
    },
})


const asistenteAdministrador = mongoose.model('asistenteAdministrador', asistenteAdministradorSchema);
module.exports = asistenteAdministrador;