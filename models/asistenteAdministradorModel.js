
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  asistenteAdministradorSchema = new Schema({
    esPrincipal: {
        type: Boolean,
        required: true
    },
})


const AsistenteAdministrador = mongoose.model('asistenteAdministrador', asistenteAdministradorSchema);
module.exports = AsistenteAdministrador;