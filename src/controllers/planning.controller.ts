import { Request, Response } from "express";
import mongoose from 'mongoose';
import { IPlanning, PlanningModel} from "../presentation/Models/planning.model";


// const Actividad = mongoose.model('Actividad', actividad);

export class PlanningController {


    constructor () {}

    public createPlanning = async (req: Request, res: Response) => {
        try {
            const { semester, campus } = req.body;
            const year = new Date().getFullYear();
            const planningExists = await PlanningModel.findOne({ semester, campus, year });
    
            if (!planningExists) {
                const newPlanning = new PlanningModel({ semester, campus, year });
                await newPlanning.save();
                return res.status(201).json(newPlanning); // Return 201 status for created resource
            } else {
                return res.status(400).json({ error: "La planificación ya existe para el campus y semestre especificados." });
            }
        } catch (error) {
            return res.status(500).json({ error: "No se pudo crear la planificación con éxito." });
        }
    }
    

   public getPlannings = async (req: Request, res: Response) => {
    try {
        const { semester } = req.query; // Use query parameters instead of body
        const year = new Date().getFullYear();

        if (!semester) {
            return res.status(400).json({ error: "El parámetro 'semester' es requerido." });
        }

        const plannings = await PlanningModel.find({ semester: semester, year: year });
        return res.json(plannings);
    } catch (error) {
        return res.status(500).json({ error: "No se pudieron recuperar las planificaciones." });
    }
}


    public getPlanningByCampus = async (req: Request, res: Response) => {
        try {
            const { semester, campus } = req.query; // Use query parameters
            const year = new Date().getFullYear();

            if (!semester || !campus) {
                return res.status(400).json({ error: "Los parámetros 'semester' y 'campus' son requeridos." });
            }

            const planning = await PlanningModel.findOne({ semester: semester as string, campus: campus as string, year: year });

            if (!planning) {
                return res.status(404).json({ error: "No se pudo encontrar la planificación para el campus y semestre especificados." });
            }

            return res.json(planning);
        } catch (error) {
            return res.status(500).json({ error: "Error al recuperar la planificación." });
        }
    }





}


