import mongoose, {Document} from 'mongoose';
import {campus as CampusEnum } from '../../utils/campus'

import bcrypt from 'bcrypt';
export enum campus {
    CARTAGO = 'Cartago',
    SAN_JOSE = 'San Jose',
    SAN_CARLOS = 'San Carlos',
    ALAJUELA = 'Alajuela',
    LIMON = 'Limon'
};

export enum rol {
    ADMIN = 'admin',
    PROFESOR_GUIA = 'profesor guia',
    ESTUDIANTE = 'estudiante'
};

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    firstLastname: string;
    secondLastname: string;
    campus: string;
    photo: string;
    rol: string;
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
}

const options: { discriminatorKey: string } = { discriminatorKey: 'userType' };


const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        //match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], 
        lowercase: true
    },
    password: {
        type: String,
        required: true
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
        enum: CampusEnum,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    rol: {
        type: String,
        enum: rol,
        required: true
    }
}, options);

usuarioSchema.methods.encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

usuarioSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

export const UsuarioModel = mongoose.model<IUser>('Usuarios', usuarioSchema);
