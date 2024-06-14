// auth.controller.ts

import { User } from '../models/user.model';
import { IAuthenticable } from '../models/student-wrapper.model';
import { AuthenticableWrapper } from '../models/student-wrapper.model';
import { NextFunction, Request, Response } from 'express';
import jwt  from 'jsonwebtoken';

interface IPayload {
    _id: string;
    iat: number;
} 

export class AuthController{
    
    public static async signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
        
        const emailExistsAuthWrapper = await AuthenticableWrapper.findOne({ email: req.body.email });   
        const emailExistUser = await User.findOne({ email: req.body.email });
        if (emailExistsAuthWrapper || emailExistUser) {
            return res.status(400).json('Correo ya existe');
        }
        else{
            try {
                const auth: IAuthenticable= new AuthenticableWrapper(req.body);
                return auth.signUp(req, res);
            } catch (error) {
                res.status(400).json({ error: error });
            }
            
            
        }
    }

    public static async signIn(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
        const emailExistsAuthWrapper = await AuthenticableWrapper.findOne({ email: req.body.email });
        const emailExistUser = await User.findOne ({ email: req.body.email });
        if (emailExistsAuthWrapper) {
            return emailExistsAuthWrapper.signIn(req, res);
        }
        else if(emailExistUser){
            return emailExistUser.signIn(req, res);
        }
        else{
            return res.status(400).json('Correo no existe');
        }
    }

    public static async profile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {  
        const emailExistsAuthWrapper = await AuthenticableWrapper.findOne({ email: req.body.email });
        const emailExistUser = await User.findOne ({ email: req.body.email });
        if (emailExistsAuthWrapper) {
            return emailExistsAuthWrapper.profile(req, res);
        }
        else if(emailExistUser){
            return emailExistUser.profile(req, res);
        }
        else{
            return res.status(400).json('Correo no existe');
        }
    }

    public static async validateToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.header('auth-token');
            if (!token) return res.status(401).json('Access Denied');
            const payload = jwt.verify(token, process.env['TOKEN_SECRET'] || 'testToken') as IPayload;
            req.userId = payload._id;
            next();
        } catch (e) {
            res.status(400).send('Invalid Token');
        }
    }
}
