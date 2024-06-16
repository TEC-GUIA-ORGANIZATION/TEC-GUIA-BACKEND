// mailbox.model.ts

import mongoose from 'mongoose';
import { INotificacion } from './notification.model'; 

export interface IMailbox extends Document {
    notificaciones?: INotificacion[]
}

const mailboxSchema = new mongoose.Schema<IMailbox>({
    notificaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }]
});

export const Mailbox = mongoose.model<IMailbox>('Mailbox', mailboxSchema);
