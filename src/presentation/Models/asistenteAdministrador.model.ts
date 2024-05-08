import mongoose from 'mongoose';
import { IUser, UsuarioModel } from './usuario.model';

export interface IAdminAssistant extends Document,IUser {
    isMain: boolean;
}

const AdminAssistantSchema = new mongoose.Schema<IAdminAssistant>({
    isMain: {
        type: Boolean,
        required: true
    },
});

export const AdminAssistantModel = UsuarioModel.discriminator('adminAssistant', AdminAssistantSchema);
