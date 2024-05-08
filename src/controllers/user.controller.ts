import mongoose from "mongoose";
import { Request, Response } from "express";
import { UsuarioModel } from "../presentation/Models/usuario.model";

export class UserController {

    public constructor() {}

    public getUsers = async(req: Request, res: Response) => {
        const users = await UsuarioModel.find({}).sort({createdAt: -1});
        res.status(200).json(users);
    }

    public getUserById = async (req: Request, res: Response) => {
        const id  = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(404).json({error: 'Usuario no encontrado.'});
        
        const user = await UsuarioModel.findById(id);

        if (!user) 
          return res.status(404).json({error: 'Usuario no encontrado.'});
        
        res.status(200).json(user);
      }

    public addUser = async (req: Request, res: Response) => {
        try {
            const user = await UsuarioModel.create(req.body);
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error });
        }
    }

    public deleteUser = async (req: Request, res: Response) => {
        const id  = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(404).json({ error: 'ID no valido, intentelo de nuevo' });
        
        const user = await UsuarioModel.findByIdAndDelete(id);
        return (!user) 
        ? res.status(404).json({ error: 'Usuario no encontrado.' })
        : res.status(200).json(user);
    }

    public updateUser = async (req: Request, res: Response) => {
        const id  = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id))
          return res.status(404).json({error: 'Usuario no encontrado.'});
        
        const user = await UsuarioModel.findByIdAndUpdate(id, req.body, { new: true });
      
        return (!user) 
        ? res.status(400).json({error: 'No existe le usuario'})
        : res.status(200).json(user);
    }
}