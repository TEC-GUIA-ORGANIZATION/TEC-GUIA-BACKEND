// user.controller.ts

import mongoose from "mongoose";
import { Request, Response } from "express";
import { User } from "../models/user.model";

// User controller class
// This class contains methods to handle the users
export class UserController {

    /**
     * Get all users
     * Returns all the users stored in the database
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static getUsers = async(req: Request, res: Response) => {
        const users = await User.find({}).sort({createdAt: -1});
        res.status(200).json(users);
    }

    /**
     * Get a user by ID
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static getUserById = async (req: Request, res: Response) => {
        const id  = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(404).json({error: 'Usuario no encontrado.'});
        
        const user = await User.findById(id);

        if (!user) 
          return res.status(404).json({error: 'Usuario no encontrado.'});
        
        res.status(200).json(user);
      }

    /**
     * Add a new user 
     * @param req - Express Request object 
     * @param res - Express Response object 
     * @returns Response object with the new user or error message 
     */
    public static addUser = async (req: Request, res: Response) => {
        try {
            const user = await User.create(req.body);
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error });
        }
    }

    /**
     * Delete a user 
     * @param req - Express Request object 
     * @param res - Express Response object 
     * @returns Response object with the deleted user or error message 
     */
    public static deleteUser = async (req: Request, res: Response) => {
        const id  = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) 
            return res.status(404).json({ error: 'ID no valido, intentelo de nuevo' });
        
        const user = await User.findByIdAndDelete(id);
        return (!user) 
        ? res.status(404).json({ error: 'Usuario no encontrado.' })
        : res.status(200).json(user);
    }

    /**
     * Update a user 
     * @param req - Express Request object 
     * @param res - Express Response object 
     * @returns Response object with the updated user or error message 
     */
    public static updateUser = async (req: Request, res: Response) => {
        const id  = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id))
          return res.status(404).json({error: 'ID no valido, intentelo de nuevo.'});
        
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      
        return (!user) 
        ? res.status(400).json({error: 'No existe le usuario'})
        : res.status(200).json(user);
    } 
}
