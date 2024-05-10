import mongoose from 'mongoose';
import { IUser, UserModel} from './usuario.model';

export interface IAdminAssistant extends Document,IUser {
    isMain: boolean;
}

const AdminAssistantSchema = new mongoose.Schema<IAdminAssistant>({
    isMain: {
        type: Boolean,
        required: true
    },
});

export const AdminAssistantModel = UserModel.discriminator('adminAssistant', AdminAssistantSchema);
