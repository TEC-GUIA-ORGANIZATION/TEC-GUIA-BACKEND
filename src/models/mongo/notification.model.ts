import mongoose, {Document} from 'mongoose';
import { IAuthenticable } from './student-wrapper.model';
import { IMessage } from './message.model';

export interface INotificacion extends Document, IAuthenticable{
    mensaje: IMessage;
    leido: Boolean;
}

const NotificationSchema = new mongoose.Schema({
    mensaje: {
        type: mongoose.Schema.Types.ObjectId,
        reference: 'Message',
        required: true
    },
    leido: {
        type: Boolean,
        required: true
    }
});

export const Notification = mongoose.model<INotificacion>('Notification', NotificationSchema);
