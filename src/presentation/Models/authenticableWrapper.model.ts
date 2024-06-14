import { rol } from '../../utils/rol.enum';
import { IStudent } from './students.model';
import mongoose, {Document} from 'mongoose';
import bcrypt from 'bcrypt';
import { IAuthenticable } from './authenticable.interface';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { envs } from "../../config/envs";

export interface IAuthenticableWrapper extends Document, IAuthenticable {
    student: IStudent;
    password: string;
    rol: string;
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
    signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    signIn(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    profile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;

}

const AuthenticableWrapperSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Students',
        required: false
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: rol,
        required: true
    }
    
});

AuthenticableWrapperSchema.methods.encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

AuthenticableWrapperSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}
AuthenticableWrapperSchema.methods.signUp = async function(req: Request, res: Response) {
        
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

AuthenticableWrapperSchema.methods.signIn = async function(req: Request, res: Response) {
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

AuthenticableWrapperSchema.methods.profile = async function(req: Request, res: Response) {
    const user = await this.findById(req.userId);
    if(!user) 
        return res.status(404).json('Usuario no encontrado');

    res.json(user);
}

AuthenticableWrapperSchema.methods.assignRol = async function(req: Request, res: Response) {
    let newUser: IAuthenticableWrapper;
    newUser = new AuthenticableWrapperModel(req.body);

    newUser.password = await newUser.encryptPassword(newUser.password);

    return newUser;
}
export const AuthenticableWrapperModel = mongoose.model<IAuthenticableWrapper>('AuthenticableWrapper', AuthenticableWrapperSchema);