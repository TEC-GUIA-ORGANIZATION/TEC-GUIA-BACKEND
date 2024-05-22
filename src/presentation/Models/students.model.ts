import mongoose, {Document} from 'mongoose';
import { IUser, UsuarioModel} from './usuario.model';
import { semester } from '../../utils/semesters.enum';

export interface IStudent extends Document,IUser {
    institutionId: number;
    personalPhone: string;
    semester: string;
    entryYear: number;
}

const StudentSchema =  new mongoose.Schema<IStudent>({
    institutionId: {
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
    }

});

export const StudentModel = UsuarioModel.discriminator('Students', StudentSchema);
