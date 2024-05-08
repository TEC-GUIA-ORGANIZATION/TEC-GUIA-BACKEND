import mongoose from 'mongoose';
import { IUser, UsuarioModel } from './usuario.model';


export interface IGuideProfessor extends Document, IUser {
    code: string;
    officePhone: string;
    personalPhone: string;
    isCoordinator?: boolean;
    isActive?: boolean;
}

const profesorGuiaSchema = new mongoose.Schema<IGuideProfessor>({
    code: {
        type: String,
        required: true
    },
    officePhone: {
        type: String,
        required: true,
        unique: true
    },
    personalPhone: {
        type: String,
        required: false,
        unique: true
    },
    isCoordinator: {
        type: Boolean,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
});

export const ProfesorGuiaModel = UsuarioModel.discriminator('ProfesorGuia', profesorGuiaSchema);