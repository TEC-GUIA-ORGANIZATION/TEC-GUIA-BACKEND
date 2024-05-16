import mongoose, {Document} from 'mongoose';
import { IUser, UsuarioModel } from './usuario.model';


export interface IGuideProfessor extends Document, IUser {
    code: string;
    officePhone: string;
    personalPhone: string;
    isActive?: boolean;
}

const professorSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    officePhone: {
        type: String,
        required: true,
    },
    personalPhone: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true
    },
});

export const ProfesorGuiaModel = UsuarioModel.discriminator<IGuideProfessor>('ProfesorGuia', professorSchema);

