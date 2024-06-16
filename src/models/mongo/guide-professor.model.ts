// guide-professor.model.ts

import mongoose, {Document} from 'mongoose';
import { IUser, User } from './user.model';

// Guide Professor interface
export interface IGuideProfessor extends Document, IUser {
    code: string;
    officePhone: string;
    personalPhone: string;
    isActive?: boolean;
}

// Guide Professor schema
// This schema defines the structure of a guide professor
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
