import mongoose, {Document} from 'mongoose';
import { IAuthenticable } from './student-wrapper.model';
import { IMensaje } from './mensaje.model';

export interface INotificacion extends Document, IAuthenticable{
    mensaje: IMensaje;
    leido: Boolean;
}

const NotificationSchema = new mongoose.Schema({
    mensaje: {
        type: String,
        required: true
    },
    leido: {
        type: Boolean,
        required: true
    }
});

export const Notification = mongoose.model<INotificacion>('Notification', NotificationSchema);
