const mongoose = require('mongoose')
const Schema = mongoose.Schema




const Respuesta = mongoose.model('Respuesta',respuestaSchema);
module.exports = Respuesta;