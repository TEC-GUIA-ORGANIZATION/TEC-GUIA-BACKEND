// message.model.ts

import mongoose, {Document} from 'mongoose';
import { IActivity } from '../activity.model';

export interface IMessage extends Document {
    contenido: String;
    fecha: Date;
    emisor: IActivity;
}

const messageSchema = new mongoose.Schema<IMessage>({
    contenido: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    emisor: {
        type: String,
        required: true,
    },
})

export const Message = mongoose.model<IMessage>('Message', messageSchema);
