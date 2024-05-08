import mongoose from 'mongoose';

const asistenteAdministradorSchema = new mongoose.Schema({
    esPrincipal: {
        type: Boolean,
        required: true
    },
});

export const AsistenteAdministradorModel = mongoose.model('asistenteAdministrador', asistenteAdministradorSchema);
