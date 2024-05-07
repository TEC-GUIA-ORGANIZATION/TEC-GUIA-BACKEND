import { IUser, UsuarioModel as User } from '../presentation/Models/usuario.model';
import jwt from 'jsonwebtoken';
import { ProfesorGuiaModel } from '../presentation/Models/profesorGuia.model';
import { AsistenteAdministradorModel } from '../presentation/Models/asistenteAdministrador.model';
import { Request, Response } from 'express';
import { envs } from "../config/envs";

export class AuthController {

    public signUp = async (req: Request, res: Response) => {

        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) return res.status(400).json('Correo ya existe');

        try {
            const newUser: IUser = new User(req.body);
            newUser.password = await newUser.encryptPassword(newUser.password);

            // if (newUser.rol === 'admin') {
            //     const idAdmin = await this.createAdmin(req, res);
            //     newUser.adminInfo = idAdmin.toString();
            // }
                



            const savedUser = await newUser.save();
            //*Token
            const token: string = jwt.sign({ _id: savedUser._id }, envs.TOKEN_SECRET || 'tokentest', {
                expiresIn: 60 * 60 * 24
            });
            res.header('auth-token', token).json(savedUser);  
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los datos' });
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

    public createAdmin = async(req: Request, res: Response): Promise<string> => {
        try {
            const { esPrincipal } = req.body;
            const newAdminInfo = new AsistenteAdministradorModel({ esPrincipal });
            const adminInfoSaved = await newAdminInfo.save();
            return adminInfoSaved._id.toString();
        } catch (error) {
            throw error;
        }
    }
    
    public createProfesorGuia = async (req: Request, res: Response): Promise<string> => {
        try {
            const { codigo, telefonoOficina, telefonoPersonal, esCoordinador, estaActivo } = req.body;
            const newProfesorGuiaInfo = new ProfesorGuiaModel({
                codigo,
                telefonoOficina,
                telefonoPersonal,
                esCoordinador,
                estaActivo
            });
            const profesorGuiaSaved = await newProfesorGuiaInfo.save();
            return profesorGuiaSaved._id.toString();
        } catch (error) {
            throw error;
        }
    }

}
