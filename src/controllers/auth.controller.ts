import { IUser, UsuarioModel as User, UsuarioModel } from '../presentation/Models/usuario.model';
import { IAuthenticable } from '../presentation/Models/authenticable.interface';
import { IAuthenticableWrapper,AuthenticableWrapperModel as AuthenticableWrapper } from '../presentation/Models/authenticableWrapper.model';
import jwt from 'jsonwebtoken';
import { AdminAssistantModel as AdminUser } from '../presentation/Models/asistenteAdministrador.model';
import { ProfesorGuiaModel as ProfesorUser } from '../presentation/Models/profesorGuia.model';
import { Request, Response } from 'express';
import { envs } from "../config/envs";
import { rol } from "../utils/rol.enum";

export class AuthController{
    
    async signUp(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
        
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
    async signIn(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
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
    async profile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {  
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


}
