// user.model.ts

import mongoose, { Document } from 'mongoose';
import { Request, Response } from 'express';
import { IAuthenticable } from './student-wrapper.model';
import { Campus } from '../enums/campus.enum';
import { Role } from '../enums/role.enum';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH } from '../app.config';

// User interface
// This interface defines the structure of a user
export interface IUser extends Document, IAuthenticable {
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

    // IAuthenticable methods
    signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    signIn(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}

const options: { discriminatorKey: string } = { discriminatorKey: 'userType' };

// User schema
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
        enum: Campus,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    rol: {
        type: String,
        enum: Role,
        required: true
    }
}, options);

export const User = mongoose.model<IUser>('Usuarios', usuarioSchema);

// Encrypt password method
const encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Assign role method
const assignRole = async function(req: Request, res: Response) {
    const { GuideProfessor } = await import('./guide-professor.model');
    const { AdminAssistant } = await import('./admin-assistant.model');

    let newUser: IUser;
    (req.body.rol === Role.PROFESOR_GUIA) 
    ? newUser = new GuideProfessor(req.body) 
    : newUser = new AdminAssistant(req.body);

    newUser.password = await encryptPassword(newUser.password);
    return newUser;
} 

// Validate password method
const validatePassword = async function (password: string, encryptedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, encryptedPassword);
}

// Sign up method
usuarioSchema.methods.signUp = async function(req: Request, res: Response) {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).json('Correo ya existe');

    try {
        const savedUser = await assignRole(req, res);
        await savedUser.save();

        const token: string = jwt.sign({ _id: savedUser._id }, AUTH.jwtSecret || 'tokentest', {
            expiresIn: 60 * 60 * 24});

        res.header('auth-token', token).json(savedUser); 
    } catch (error) {
        res.status(500).json(error);
    }
}

// Sign in method
usuarioSchema.methods.signIn = async function(req: Request, res: Response) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json('El email no es válido.');

    const correctPassword: boolean = await validatePassword(req.body.password, user.password);
    if (!correctPassword) return res.status(400).json('Contraseña invalida');

    const token: string = jwt.sign({ _id: user._id }, AUTH.jwtSecret || 'tokentest', {
        expiresIn: 60 * 60 * 24
    });

    res.set('Access-Control-Expose-Headers', 'auth-token');
    res.header('auth-token', [token]).json(user);
    
    console.log(req.body);
}
