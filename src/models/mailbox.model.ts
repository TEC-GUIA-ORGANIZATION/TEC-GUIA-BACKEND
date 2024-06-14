import mongoose from 'mongoose';
import { INotificacion } from './notification.model';


export interface IMailbox extends Document {
    notificaciones?: INotificacion[]
}

const activitySchema = new mongoose.Schema<IMailbox>({
    notificaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }]
});

export const ActivityModel = mongoose.model('Actividades', activitySchema);

