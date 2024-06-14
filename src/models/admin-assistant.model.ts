import mongoose from 'mongoose';
import { IUser, User } from './user.model';

// Admin Assistant interface
export interface IAdminAssistant extends Document,IUser {
    isMain: boolean;
}

// Admin Assistant schema
// This schema defines the structure of an admin assistant
const AdminAssistantSchema = new mongoose.Schema<IAdminAssistant>({
    isMain: {
        type: Boolean,
        required: true
    },
});

export const AdminAssistant = User.discriminator('adminAssistant', AdminAssistantSchema);
