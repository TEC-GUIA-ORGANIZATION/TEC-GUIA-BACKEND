import { IUser, UserModel as User } from '../presentation/Models/usuario.model';
import jwt from 'jsonwebtoken';
import { AdminAssistantModel as AdminUser } from '../presentation/Models/asistenteAdministrador.model';
import { ProfesorGuiaModel as ProfesorUser } from '../presentation/Models/profesorGuia.model';
import { Request, Response } from 'express';
import { envs } from "../config/envs";
import { rol } from "../presentation/Models/usuario.model";
export class AuthController {



    public signUp = async (req: Request, res: Response) => {

        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) return res.status(400).json('Correo ya existe');

        try {
           
            const savedUser = await this.assingRol(req, res);
            await savedUser.save();
            //*Token
            const token: string = jwt.sign({ _id: savedUser._id }, envs.TOKEN_SECRET || 'tokentest', {
                expiresIn: 60 * 60 * 24});
            res.header('auth-token', token).json(savedUser); 
        } catch (error) {
            res.status(500).json(error);
        }
    }

    public signIn = async (req: Request, res: Response) => {

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json('El email no es válido.');

        const correctPassword: boolean = await user.validatePassword(req.body.password);
        if (!correctPassword) return res.status(400).json('Contraseña invalida');

        const token: string = jwt.sign({ _id: user._id }, envs.TOKEN_SECRET || 'tokentest', {
            expiresIn: 60 * 60 * 24
        });
        res.header('auth-token', token).json(user);

        console.log(req.body);
    }

    public profile = async (req: Request, res: Response) => {
        const user = await User.findById(req.userId);
        if(!user) 
            return res.status(404).json('Usuario no encontrado');
        res.json(user);
    }

    public assingRol = async (req: Request, res: Response) => {
        let newUser: IUser;
        (req.body.rol === rol.PROFESOR_GUIA) 
        ? newUser = new ProfesorUser(req.body) 
        : newUser = new AdminUser(req.body);

        newUser.password = await newUser.encryptPassword(newUser.password);
        return newUser;
    } 

}