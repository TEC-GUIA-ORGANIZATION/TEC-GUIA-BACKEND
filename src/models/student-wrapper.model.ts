// student-wrapper.model.ts

import mongoose, { Document } from 'mongoose';
import { Request, Response } from 'express';
import { Role } from '../enums/role.enum';
import { IStudent } from '../models/student.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH } from '../app.config';

// Authenticable interface
// This interface is used to handle the authentication
export interface IAuthenticable extends Document {
    signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    signIn(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    profile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}

// Authenticable Wrapper interface 
// This interface defines the structure of an authenticable wrapper
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

// Authenticable Wrapper schema 
// This schema defines the structure of an authenticable wrapper
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
        enum: Role,
        required: true
    }
});

// Encrypt password method
AuthenticableWrapperSchema.methods.encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Validate password method
AuthenticableWrapperSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

// Sign up method
AuthenticableWrapperSchema.methods.signUp = async function(req: Request, res: Response) {
        
    const emailExist = await this.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).json('Correo ya existe');

    try {
        const savedUser = await this.assingRol(req, res);
        await savedUser.save();

        const token: string = jwt.sign({ _id: savedUser._id }, AUTH.jwtSecret || 'tokentest', {
            expiresIn: 60 * 60 * 24});

        res.header('auth-token', token).json(savedUser); 
    } catch (error) {
        res.status(500).json(error);
    }
}

// Sign in method
AuthenticableWrapperSchema.methods.signIn = async function(req: Request, res: Response) {
    const user = await this.findOne({ email: req.body.email });
    if (!user) return res.status(400).json('El email no es válido.');

    const correctPassword: boolean = await user.validatePassword(req.body.password);
    if (!correctPassword) return res.status(400).json('Contraseña invalida');

    const token: string = jwt.sign({ _id: user._id }, AUTH.jwtSecret || 'tokentest', {
        expiresIn: 60 * 60 * 24
    });

    res.set('Access-Control-Expose-Headers', 'auth-token');
    res.header('auth-token', [token]).json(user);
    
    console.log(req.body);
}

// Profile method
AuthenticableWrapperSchema.methods.profile = async function(req: Request, res: Response) {
    const user = await this.findById(req.userId);
    if(!user) 
        return res.status(404).json('Usuario no encontrado');

    res.json(user);
}

// Assign rol method
AuthenticableWrapperSchema.methods.assignRol = async function(req: Request, res: Response) {
    let newUser: IAuthenticableWrapper;
    newUser = new AuthenticableWrapper(req.body);

    newUser.password = await newUser.encryptPassword(newUser.password);

    return newUser;
}

export const AuthenticableWrapper = mongoose.model<IAuthenticableWrapper>('AuthenticableWrapper', AuthenticableWrapperSchema);
