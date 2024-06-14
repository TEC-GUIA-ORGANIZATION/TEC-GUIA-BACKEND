import mongoose, {Document} from 'mongoose';
import { IUser, UsuarioModel} from './usuario.model';
import { semester } from '../../utils/semesters.enum';

export interface IStudent extends Document {
    institutionID: number;
    personalPhone: string;
    semester: string;
    entryYear: number;
    email: string;
    name: string;
    firstLastname: string;
    secondLastname: string;
    campus: string;
    photo: string;
}

const StudentSchema =  new mongoose.Schema<IStudent>({
    institutionID: {
        type: Number,
        required: true
    },
    personalPhone : {
        type: String,
        required: true,
        unique: true
    },
    semester: {
        type: String,
        enum: semester,
        required: true
    },
    entryYear : {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    firstLastname: {
        type: String,
        required: true
    },
    secondLastname: {
        type: String,
        required: true
    },
    campus: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    }



});

export const StudentModel = UsuarioModel.discriminator('Students', StudentSchema);
