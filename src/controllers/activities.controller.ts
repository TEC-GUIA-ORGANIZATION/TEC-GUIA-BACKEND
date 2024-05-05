import { Request, Response } from "express";
import mongoose from 'mongoose';
import { ActividadModel } from '../presentation/Models/activities.model';

// const Actividad = mongoose.model('Actividad', actividad);

export class ActivitiesController {


    constructor() { }

    public getActivities = async (req: Request, res: Response) => {
        try {
            const actividades = await ActividadModel.find();
            return res.json(actividades);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al obtener los datos' });
        }
    }

    public getActivitiesById = async (req: Request, res: Response) => {
        try {
            const actividad = await ActividadModel.findById(req.params.id);
            if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });

            return res.json(actividad);
        } catch (error) {
            console.error('Error al obtener la actividad:', error);
            res.status(500).json({ error: 'Error al obtener la actividad' });
        }
    }

    public createActivity = async (req: Request, res: Response) => {
        try {
            const newActivity = new ActividadModel(req.body);
            await newActivity.save();
            res.status(200).json(newActivity);
        } catch (error) {
            res.status(500).json({ error: 'Error al guardar la actividad' });
        }

    }

    public deleteActivity = async (req: Request, res: Response) => {
        try {
            const actividadEliminada = await ActividadModel.findByIdAndDelete(req.params.id);
            return (!actividadEliminada)
                ? res.status(404).json({ error: 'Actividad no encontrada. ' })
                : res.json({ mensaje: 'Actividad eliminada correctamente.' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar la actividad' });
        }
    }


    // Actualizar una actividad por ID
    public updateActivity = async (req: Request, res: Response) => {
        try {
            const actividadActualizada = await ActividadModel.findByIdAndUpdate(req.params.id, req.body, { new: true }); //* {new:true} permite ver el objeto json actualizado.
            return (!actividadActualizada)
                ? res.status(404).json({ error: 'Actividad no encontrada' })
                : res.json(actividadActualizada);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la actividad' });
        }
    }

}

