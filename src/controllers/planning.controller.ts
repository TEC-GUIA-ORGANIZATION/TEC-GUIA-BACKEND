import { Request, Response } from "express";
import { Planning } from "../models/planning.model";
import { Activity } from "../models/activity.model";

// Planning controller class
// This class contains methods to handle the planning
export class PlanningController {

    /**
     * Create a new planning
     * @param req - Express Request object
     * @param res - Express Response object
     * @returns Response object with the new planning or error message
     */
    public static createPlanning = async (req: Request, res: Response) => {
        try {
            const { semester, campus } = req.body;
            const year = new Date().getFullYear();
            const planningExists = await Planning.findOne({ semester, campus, year });

            if (!planningExists) {
                const newPlanning = new Planning({ semester, campus, year });
                await newPlanning.save();
                return res.status(201).json(newPlanning); // Return 201 status for created resource
            } else {
                return res.status(400).json({ error: "La planificación ya existe para el campus y semestre especificados." });
            }
        } catch (error) {
            return res.status(500).json({ error: "No se pudo crear la planificación con éxito." });
        }
    }

    /**
     * Get the next upcoming activity from a planning 
     * @param req - Express Request object
     * @param res - Express Response object
     * @returns Response object with the next activity or error message
     */
    public static getNextActivity = async (req: Request, res: Response) => {
        try {
            const { planningId } = req.query; // Assuming you pass planningId as a query parameter

            // Validate the presence of planningId
            if (!planningId) {
                return res.status(400).json({ error: "El parametro planningId es requerido." });
            }

            // Retrieve the specified planning document to get its activities
            const planning = await Planning.findById(planningId);
            if (!planning || !planning.activities || planning.activities.length === 0) {
                return res.status(404).json({ error: "Planificación no encontrada o sin actividades." });
            }

            const now = new Date();
            const utcNow = new Date(now.toISOString());

            // Find the next upcoming activity that is part of the planning
            const actividad = await Activity
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

    /**
     * Get the activities of a planning
     * @param req - Express Request object
     * @param res - Express Response object
     * @returns Response object with the activities or error message
     */
    public static getPlanningById = async (req: Request, res: Response) => {
        try {
            const { idPlanning } = req.query; // Use query parameters

            if (!idPlanning) {
                return res.status(400).json({ error: "El parametro idPlanning es requerido." });
            }

            const planning = await Planning.findById(idPlanning);

            if (!planning) {
                return res.status(404).json({ error: "No se pudo encontrar la planificación para el campus y semestre especificados." });
            }

            return res.json(planning);
        } catch (error) {
            return res.status(500).json({ error: "Error al recuperar la planificación." });
        }
    }

    /**
     * Get the activities of a planning
     * @param req - Express Request object
     * @param res - Express Response object
     * @returns Response object with the activities or error message
     */
    public static getActivitiesByPlanning = async(req:Request, res:Response) => {
        try {
            const { semester, year } = req.query; // Use query parameters

            if (!semester || !year) {
                return res.status(400).json({ error: "Los parámetros 'semester' y 'year' son requeridos." });
            }

            const planning = await Planning.findOne({ semester: semester as string, year: (year as string) });

            if (!planning) {
                return res.status(404).json({ error: "No se pudo encontrar la planificación para el semestre especificado." });
            }

            const activities = await Activity.find({ _id: { $in: planning.activities } });

            return res.json(activities);
        } catch (error) {
            return res.status(500).json({ error: "Error al recuperar la planificación." });
        }
    }
}
