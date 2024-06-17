// activity.controller.ts
import { Request, Response } from "express";
import mongoose from 'mongoose';
import { ActivityStatus } from '../models/activity.model';
import { Activity } from "../models/mongo/activity.model";
import { Planning } from "../models/mongo/planning.model";
import { HandleError } from "../utils/error";
import { Program } from "../services/program.service";
import { Activity as ActivityObject } from "../models/automation/activity.model";

// Activities controller singleton
// This class contains methods to handle the activities
export class ActivitiesController {

    /**
     * Get all activities
     * Returns all the activities stored in the database
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static getActivities = async (req: Request, res: Response) => {
        try {
            const activities = await Activity.find();
            res.json(activities);
        } catch (error) {
            HandleError(res, error, 'Error al obtener las actividades');
        }
    }

    /**
     * Get an activity by ID
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static getActivityById = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const activity = await Activity.findById(id);
            if (!activity) return res.status(404).json({ error: 'Actividad no encontrada' });

            res.json(activity);
        } catch (error) {
            HandleError(res, error, 'Error al obtener la actividad');
        }
    }

    /**
     * Get the next upcoming activity
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static getNextActivity = async (req: Request, res: Response) => {
        try {
            const now = new Date().toISOString();
            const nextActivity = await Activity.findOne({ date: { $gt: now } }).sort({ date: 1 });
            if (!nextActivity) return res.status(404).json({ error: 'Actividad no encontrada' });

            res.json(nextActivity);
        } catch (error) {
            HandleError(res, error, 'Error al obtener la siguiente actividad');
        }
    }

    /**
     * Create a new activity
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static createActivity = async (req: Request, res: Response) => {
        try {
            const newActivity = new Activity(req.body);
            await newActivity.save();

            await ActivitiesController.addActivityToPlanning(newActivity._id);

            Program.getInstance().addActivity(
                new ActivityObject(
                    newActivity._id.toString(),
                    newActivity.week,
                    newActivity.date,
                    newActivity.type,
                    newActivity.name,
                    newActivity.description,
                    newActivity.responsible,
                    newActivity.daysToAnnounce,
                    newActivity.daysToRemember,
                    newActivity.modality,
                    newActivity.placeLink,
                    newActivity.poster,
                    newActivity.status,
                    [], // Subscribers
                    newActivity.evidence,
                    newActivity.comments
                )
            );

            res.status(201).json(newActivity);
        } catch (error) {
            HandleError(res, error, 'Error al crear la actividad');
        }
    }

    /**
     * Delete an activity by ID
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static deleteActivity = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const deletedActivity = await Activity.findByIdAndDelete(id);
            if (!deletedActivity) return res.status(404).json({ error: 'Actividad no encontrada' });

            res.json({ message: 'Actividad eliminada correctamente' });
        } catch (error) {
            HandleError(res, error, 'Error al eliminar la actividad');
        }
    }

    /**
     * Update an activity by ID
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static updateActivity = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const updatedActivity = await Activity.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedActivity) return res.status(404).json({ error: 'Actividad no encontrada o no se pudo realizar la actualización' });

            Program.getInstance().patchActivity(
                new ActivityObject(
                    updatedActivity._id.toString(),
                    updatedActivity.week,
                    updatedActivity.date,
                    updatedActivity.type,
                    updatedActivity.name,
                    updatedActivity.description,
                    updatedActivity.responsible,
                    updatedActivity.daysToAnnounce,
                    updatedActivity.daysToRemember,
                    updatedActivity.modality,
                    updatedActivity.placeLink,
                    updatedActivity.poster,
                    updatedActivity.status,
                    [], // Subscribers
                    updatedActivity.evidence,
                    updatedActivity.comments
                )
            );
            
            if (updatedActivity.status === ActivityStatus.CANCELADA) {
                Program.getInstance().getNotificationsCenter().updateCancelation(updatedActivity);
            }

            res.json(updatedActivity);
        } catch (error) {
            HandleError(res, error, 'Error al actualizar la actividad');
        }
    }

    /**
     * Mark an activity as canceled
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static cancelActivity = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const updatedActivity = await Activity.findByIdAndUpdate(id, { status: ActivityStatus.CANCELADA }, { new: true });
            if (!updatedActivity) return res.status(404).json({ error: 'Actividad no encontrada' });

            res.json(updatedActivity);
        } catch (error) {
            HandleError(res, error, 'Error al cancelar la actividad');
        }
    }

    /**
     * Mark an activity as completed
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static markActivityAsCompleted = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const updatedActivity = await Activity.findByIdAndUpdate(id, { status: ActivityStatus.REALIZADA }, { new: true });
            if (!updatedActivity) return res.status(404).json({ error: 'Actividad no encontrada' });

            res.json(updatedActivity);
        } catch (error) {
            HandleError(res, error, 'Error al marcar la actividad como completada');
        }
    }

    /**
     * Publish an activity if it meets the notification date criteria
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static publishActivity = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const activity = await Activity.findById(id);
            if (!activity) return res.status(404).json({ error: 'Actividad no encontrada' });

            const now = new Date().toISOString().slice(0, 10);
            const targetDate = new Date(activity.date);
            targetDate.setDate(targetDate.getDate() - activity.daysToAnnounce);

            if (targetDate.toISOString().slice(0, 10) === now) {
                const updatedActivity = await Activity.findByIdAndUpdate(id, { status: ActivityStatus.NOTIFICADA }, { new: true });
                if (!updatedActivity) return res.status(404).json({ error: 'Error during update' });

                res.json(updatedActivity);
            } else {
                res.status(400).json({ error: 'La actividad no cumple con la fecha para ser notificada' });
            }
        } catch (error) {
            HandleError(res, error, 'Error al public staticar la actividad');
        }
    }

    /**
     * Upload a poster for an activity
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static uploadPoster = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { poster } = req.body;

        try {
            const activity = await Activity.findById(id);
            if (!activity) return res.status(404).json({ error: 'Actividad no encontrada' });

            if (!poster) return res.status(400).json({ error: 'No se ha proporcionado un póster' });

            activity.poster = poster;
            const updatedActivity = await activity.save();
            res.json(updatedActivity);
        } catch (error) {
            HandleError(res, error, 'Error al subir el póster');
        }
    }

    /**
     * Add an activity to planning
     * @param campus - The campus of the activity
     * @param activityId - The activity ID to be added to the planning
     */
    private static addActivityToPlanning = async (activityId: mongoose.Types.ObjectId) => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const semester = month <= 6 ? 'primer semestre' : 'segundo semestre';

        try {
            const planning = await Planning.findOne({ semester, year });
            if (!planning) throw new Error("No se pudo encontrar la planificación para el campus y semestre especificados.");

            await Planning.findByIdAndUpdate(
                planning._id,
                { $push: { activities: activityId } },
                { new: true, useFindAndModify: false }
            );
        } catch (error) {
            console.error('Error al agregar la actividad a la planificación:', error);
        }
    }
}
