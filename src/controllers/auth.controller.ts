// auth.controller.ts

import { User } from '../models/mongo/user.model';
import { Student } from '../models/mongo/student.model';
import { IAuthenticable, AuthenticableWrapper } from '../models/mongo/student-wrapper.model';
import { Request, Response } from 'express';
import jwt  from 'jsonwebtoken';

interface IPayload {
    _id: string;
    iat: number;
} 

// Authentication controller class
// This class contains methods to handle the authentication
export class AuthController{
    
    /**
     * User registration endpoint
     * @param req - Express Request object
     * @param res - Express Response object
     * @returns Response object with success or error message
     */
    public static async signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
        const emailExistsAuthWrapper = await AuthenticableWrapper.findOne({ email: req.body.email });   
        const emailExistUser = await User.findOne({ email: req.body.email });

        if (emailExistsAuthWrapper || emailExistUser) {
            return res.status(400).json('Correo ya existe');
        }

        try {
            const auth: IAuthenticable= new User(req.body);
            return auth.signUp(req, res);
        } catch (error) {
            res.status(400).json({ error: error });
        }
    }

    /**
     * User login endpoint
     * @param req - Express Request object
     * @param res - Express Response object
     * @returns Response object with success or error message
     */
    public static async signIn(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
        const emailExistsStudent = await Student.findOne({ email: req.body.email });
        const emailExistUser = await User.findOne({ email: req.body.email });

        if (emailExistUser) {
            return emailExistUser.schema.methods.signIn(req, res);
        }

        if (emailExistsStudent) {
            let emailExistsAuthWrapper = await AuthenticableWrapper.findOne({ student: emailExistsStudent._id });
            if (emailExistsAuthWrapper) {
                return emailExistsAuthWrapper.schema.methods.signIn(req, res);
            }

            return res.status(400).json('Estudiante no tiene cuenta');
        }

        return res.status(400).json('Correo no existe');
    }

    /**
     * Token validation endpoint
     * @param req - Express Request object
     * @param res - Express Response object
     * @returns Response object with the user profile or error message
     */
    public static async validateToken(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {  
        try {
            const token = req.header('auth-token');
            if (!token) return res.status(401).json('Access Denied');

            const payload = jwt.verify(token, process.env['TOKEN_SECRET'] || 'testToken') as IPayload;
            req.userId = payload._id;

            let emailExistsAuthWrapper = await AuthenticableWrapper.findOne({ _id: req.userId });
            let emailExistUser = await User.findOne({ _id: req.userId });

            let user = emailExistUser || emailExistsAuthWrapper;
            if (!user) return res.status(404).json('User not found');

            res.status(200).json(user);
        } catch (e) {
            res.status(400).send('Invalid Token');
        }
    }
}
