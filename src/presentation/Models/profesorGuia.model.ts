import mongoose from 'mongoose';

const profesorGuiaSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true
    },
    telefonoOficina: {
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
});

export const ProfesorGuiaModel = mongoose.model('ProfesorGuia', profesorGuiaSchema);