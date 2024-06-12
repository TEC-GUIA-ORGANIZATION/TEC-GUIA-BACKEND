import { Request, Response } from "express";
import mongoose from 'mongoose';
import { IPlanning, PlanningModel} from "../presentation/Models/planning.model";
import { IActivity, ActivityModel } from "../presentation/Models/activities.model";


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


    public getNextActivity = async (req: Request, res: Response) => {
        try {
            const { planningId } = req.query; // Assuming you pass planningId as a query parameter

            // Validate the presence of planningId
            if (!planningId) {
                return res.status(400).json({ error: "El parametro planningId es requerido." });
            }

            // Retrieve the specified planning document to get its activities
            const planning = await PlanningModel.findById(planningId);
            if (!planning || !planning.activities || planning.activities.length === 0) {
                return res.status(404).json({ error: "Planificación no encontrada o sin actividades." });
            }

            const now = new Date();
            const utcNow = new Date(now.toISOString());

            // Find the next upcoming activity that is part of the planning
            const actividad = await ActivityModel
                .findOne({ _id: { $in: planning.activities }, date: { $gt: utcNow } })
                .sort({ date: 1 })
                .exec();

            return (!actividad)
                ? res.status(404).json({ error: 'Actividad no encontrada' })
                : res.json(actividad);

        } catch (error) {
            return res.status(500).json({ error: "Error al recuperar la próxima actividad." });
        }
    };


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


    public getPlanningById = async (req: Request, res: Response) => {
        try {
            const { idPlanning } = req.query; // Use query parameters

            if (!idPlanning) {
                return res.status(400).json({ error: "El parametro idPlanning es requerido." });
            }

            const planning = await PlanningModel.findById(idPlanning);

            if (!planning) {
                return res.status(404).json({ error: "No se pudo encontrar la planificación para el campus y semestre especificados." });
            }

            return res.json(planning);
        } catch (error) {
            return res.status(500).json({ error: "Error al recuperar la planificación." });
        }
    }

    public getActivitiesByPlanning = async (req: Request, res: Response) => {
        try {
            const { semester, campus } = req.query; // Use query parameters
            const year = new Date().getFullYear();
    
            if (!semester || !campus) {
                return res.status(400).json({ error: "Los parámetros 'semester' y 'campus' son requeridos." });
            }
    
            const planning = await PlanningModel.findOne({ semester: semester as string, campus: campus as string, year });
    
            if (!planning) {
                return res.status(404).json({ error: "No se pudo encontrar la planificación para el campus y semestre especificados." });
            }
    
            const activities = await ActivityModel.find({ _id: { $in: planning.activities } });
    
            return res.json(activities);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Error al recuperar la planificación." });
        }
    }
    


    public getActivitiesByPlanningId = async(req:Request, res:Response) => {
        try {
            const { idPlanning } = req.query; // Use query parameters
           

            if (!idPlanning) {
                return res.status(400).json({ error: "El parámetro idPlanning es requerido" });
            }

            const planning = await PlanningModel.findById(idPlanning);

            if (!planning) {
                return res.status(404).json({ error: "No se pudo encontrar la planificación para el id." });
            }

            return res.json(planning.activities);
        } catch (error) {
            return res.status(500).json({ error: "Error al recuperar la planificación." });
        }
    }


}


