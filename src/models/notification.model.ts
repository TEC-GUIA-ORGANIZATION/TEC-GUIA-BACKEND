import mongoose, {Document} from 'mongoose';
import { IAuthenticable } from './authenticable.interface';
import { Request, Response } from 'express';
import { IMensaje } from './mensaje.model';
import { IUser } from './user.model';

export interface INotificacion extends Document, IAuthenticable{
    autor: IUser;
    fecha: Date;
    hora: string;
    mensaje: IMensaje;
    leido: Boolean;
    eliminado: Boolean;
}
const notificacionSchema = new mongoose.Schema({
    autor: {
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios'} ,
        required: true,
        //match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], 
        lowercase: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    leido: {
        type: Boolean,
        required: true
    },
    eliminado: {
        type: Boolean,
        required: true
    },
});