import mongoose from 'mongoose';
import { IUser, User } from './user.model';

export interface IAdminAssistant extends Document,IUser {
    isMain: boolean;
}

const AdminAssistantSchema = new mongoose.Schema<IAdminAssistant>({
    isMain: {
        type: Boolean,
        required: true
    },
});

export const AdminAssistant = User.discriminator('adminAssistant', AdminAssistantSchema);
