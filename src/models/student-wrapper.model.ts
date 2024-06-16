// student-wrapper.model.ts

import mongoose, { Document } from 'mongoose';
import { Request, Response } from 'express';
import { Role } from '../enums/role.enum';
import { IStudent, Student } from '../models/student.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH } from '../app.config';

// Authenticable interface
// This interface is used to handle the authentication
export interface IAuthenticable extends Document {
    signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    signIn(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}

// Authenticable Wrapper interface 
// This interface defines the structure of an authenticable wrapper
export interface IAuthenticableWrapper extends Document, IAuthenticable {
    student: IStudent;
    password: string;
    rol: string;
    status: boolean;
    encryptPassword(password: string): Promise<string>;
    validatePassword(password: string): Promise<boolean>;
    signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    signIn(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
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
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    }
});

export const AuthenticableWrapper = mongoose.model<IAuthenticableWrapper>('AuthenticableWrapper', AuthenticableWrapperSchema);

// Encrypt password method
export const encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Assign role method
const assignRole = async function(req: Request, res: Response) {
    let newUser: IAuthenticableWrapper;
    newUser = new AuthenticableWrapper(req.body);
    newUser.password = await encryptPassword(newUser.password);
    return newUser;
} 

// Validate password method
const validatePassword = async function (password: string, encryptedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, encryptedPassword);
}

// Sign up method
AuthenticableWrapperSchema.methods.signUp = async function(req: Request, res: Response) {
    const emailExistsStudent = await Student.findOne({ email: req.body.email });
    if (!emailExistsStudent) return res.status(400).json('Estudiante no existe');

    const emailExistsAuthWrapper = await AuthenticableWrapper.findOne({ student: emailExistsStudent._id });
    if (emailExistsAuthWrapper) return res.status(400).json('Estudiante ya tiene cuenta');

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
AuthenticableWrapperSchema.methods.signIn = async function(req: Request, res: Response) {
    const student = await Student.findOne({ email: req.body.email });
    if (!student) return res.status(400).json('Correo no existe');

    const user = await AuthenticableWrapper.findOne({ student: student._id });
    if (!user) return res.status(400).json('Estudiante no tiene cuenta');

    const correctPassword: boolean = await validatePassword(req.body.password, user.password);
    if (!correctPassword) return res.status(400).json('Contraseña invalida');

    const token: string = jwt.sign({ _id: user._id }, AUTH.jwtSecret || 'tokentest', {
        expiresIn: 60 * 60 * 24
    });

    res.set('Access-Control-Expose-Headers', 'auth-token');
    res.header('auth-token', [token]).json(user);
}
