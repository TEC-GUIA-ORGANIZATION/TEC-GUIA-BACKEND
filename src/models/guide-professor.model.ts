// guide-professor.model.ts

import mongoose, {Document} from 'mongoose';
import { IUser, User } from './user.model';

export interface IGuideProfessor extends Document, IUser {
    code: string;
    officePhone: string;
    personalPhone: string;
    isActive?: boolean;
}

const professorSchema = new mongoose.Schema<IGuideProfessor>({
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

export const GuideProfessor = User.discriminator<IGuideProfessor>('ProfesorGuia', professorSchema);
