import { Request, Response } from 'express';

export interface IAuthenticable extends Document {
    
    signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    signIn(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    profile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;

}