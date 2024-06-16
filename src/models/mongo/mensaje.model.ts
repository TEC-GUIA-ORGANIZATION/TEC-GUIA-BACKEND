import mongoose, {Document} from 'mongoose';
import { IActivity } from './activity.model';


export interface IMensaje extends Document {
    contenido: String;
    fecha: Date;
    emisor: IActivity;
}

const mensajeSchema = new mongoose.Schema<IMensaje>({
    contenido: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    emisor: {
        type: mongoose.Schema.Types.ObjectId,
        reference: 'Activity',
        required: true,
    },
})


export const MensajeModel = mongoose.model<IMensaje>('Mensajes', mensajeSchema);
