import mongoose, {Document} from 'mongoose';


export interface IMensaje extends Document {
    contenido: String;
}

const mensajeSchema = new mongoose.Schema<IMensaje>({
    contenido: {
        type: String,
        required: true,
    },
})


export const MensajeModel = mongoose.model<IMensaje>('Mensajes', mensajeSchema);
