import mongoose, {Document} from 'mongoose';
import {campus as CampusEnum } from '../../utils/campus.enum'
import {rol } from '../../utils/rol.enum';
import { IAuthenticable } from './authenticable.interface';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';


import { AdminAssistantModel as AdminUser } from './asistenteAdministrador.model';
import { ProfesorGuiaModel as ProfesorUser } from './profesorGuia.model';
import jwt from 'jsonwebtoken';
import { envs } from "../../config/envs";




export interface IUser extends Document, IAuthenticable{
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
    signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    signIn(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    profile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;

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

usuarioSchema.methods.signUp = async function(req: Request, res: Response) {
        
    const emailExist = await this.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).json('Correo ya existe');

    try {
        const savedUser = await this.assingRol(req, res);
        await savedUser.save();

        const token: string = jwt.sign({ _id: savedUser._id }, envs.TOKEN_SECRET || 'tokentest', {
            expiresIn: 60 * 60 * 24});

        res.header('auth-token', token).json(savedUser); 
    } catch (error) {
        res.status(500).json(error);
    }
}

usuarioSchema.methods.signIn = async function(req: Request, res: Response) {
    const user = await this.findOne({ email: req.body.email });
    if (!user) return res.status(400).json('El email no es válido.');

    const correctPassword: boolean = await user.validatePassword(req.body.password);
    if (!correctPassword) return res.status(400).json('Contraseña invalida');

    const token: string = jwt.sign({ _id: user._id }, envs.TOKEN_SECRET || 'tokentest', {
        expiresIn: 60 * 60 * 24
    });

    res.set('Access-Control-Expose-Headers', 'auth-token');
    res.header('auth-token', [token]).json(user);
    
    console.log(req.body);
}

usuarioSchema.methods.profile = async function(req: Request, res: Response) {
    const user = await this.findById(req.userId);
    if(!user) 
        return res.status(404).json('Usuario no encontrado');

    res.json(user);
}

usuarioSchema.methods.assignRol = async function(req: Request, res: Response) {
    let newUser: IUser;
    (req.body.rol === rol.PROFESOR_GUIA) 
    ? newUser = new ProfesorUser(req.body) 
    : newUser = new AdminUser(req.body);

    newUser.password = await newUser.encryptPassword(newUser.password);
    return newUser;
} 

export const UsuarioModel = mongoose.model<IUser>('Usuarios', usuarioSchema);
