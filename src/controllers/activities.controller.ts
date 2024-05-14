import { Request, Response } from "express";
import mongoose from 'mongoose';
import { ActivityModel } from '../presentation/Models/activities.model';
import { activityStatusEnum } from '../presentation/Models/activities.model'

// const Actividad = mongoose.model('Actividad', actividad);

export class ActivitiesController {


    constructor() { }

    public getActivities = async (req: Request, res: Response) => {
        try {
            const actividades = await ActivityModel.find();
            return res.json(actividades);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al obtener los datos' });
        }
    }

    public getActivitiesById = async (req: Request, res: Response) => {
        try {
            const actividad = await ActivityModel.findById(req.params.id);
            if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });

            return res.json(actividad);
        } catch (error) {
            console.error('Error al obtener la actividad:', error);
            res.status(500).json({ error: 'Error al obtener la actividad' });
        }
    }

    public getNextActivity = async (req: Request, res: Response) => {
        const now = new Date(); 
        const utcNow = new Date(now.toISOString()); 
        // Find the next upcoming activity that has not occurred yet
        const actividad = await ActivityModel
            .findOne({ date: { $gt: utcNow } })
            .sort({ date: 1 }) 
            .exec(); 
        return (!actividad) 
        ? res.status(404).json({ error: 'Actividad no encontrada' })
        : res.json(actividad);
    }



    public createActivity = async (req: Request, res: Response) => {
        try {
            const newActivity = new ActivityModel(req.body);

            //Revisar bien esto, puede ser mas sencillo validarlo desde el front
            /*
            // const attribute = newActivity.evidence?.attendancePhoto.toString();
            // console.log(attribute);
            // const isEvidenceComplete: boolean = (attribute != null && attribute != "" && attribute != undefined);
            // console.log(isEvidenceComplete);

            // const evidence = newActivity.evidence;

            // const prueba:boolean = (evidence != undefined && evidence != null);
            // console.log(prueba)

            // if(!(newActivity.activityStatus === 'REALIZADA' && isEvidenceComplete)) 
            //     res.status(400).json({ error: 'Por favor completar todos los campos.' });
*/





            await newActivity.save();
            res.status(200).json(newActivity);
        } catch (error) {
            res.status(500).json({ error: 'Error al guardar la actividad' });
        }

    }

    public deleteActivity = async (req: Request, res: Response) => {
        try {
            const actividadEliminada = await ActivityModel.findByIdAndDelete(req.params.id);
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
            const actividadActualizada = await ActivityModel.findByIdAndUpdate(req.params.id, req.body, { new: true }); //* {new:true} permite ver el objeto json actualizado.
            return (!actividadActualizada)
                ? res.status(404).json({ error: 'Actividad no encontrada' })
                : res.json(actividadActualizada);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la actividad' });
        }
    }

    public cancelActivity = async (req: Request, res: Response) => {
        try {
            const actividadActualizada = await ActivityModel.findByIdAndUpdate(
                req.params.id, 
                { activityStatus: activityStatusEnum.CANCELADA }, 
                { new: true }
            ); 
            return (!actividadActualizada)
                ? res.status(404).json({ error: 'Actividad no encontrada' })
                : res.json(actividadActualizada);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la actividad' });
        }
    }


    public markActivityAsCompleted = async (req: Request, res: Response) => {
        try {
            const actividadActualizada = await ActivityModel.findByIdAndUpdate(
                req.params.id, 
                { activityStatus: activityStatusEnum.REALIZADA }, 
                { new: true }
            ); 
            return (!actividadActualizada)
                ? res.status(404).json({ error: 'Actividad no encontrada' })
                : res.json(actividadActualizada);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la actividad' });
        }
    }


    // public publishActivity = async (req: Request, res: Response) => {
    //     try {
    //         const actividadActualizada = await ActivityModel.findByIdAndUpdate(
    //             req.params.id, 
    //             { activityStatus: activityStatusEnum.NOTIFICADA }, 
    //             { new: true }
    //         ); 
    //         return (!actividadActualizada)
    //             ? res.status(404).json({ error: 'Actividad no encontrada' })
    //             : res.json(actividadActualizada);
    //     } catch (error) {
    //         res.status(500).json({ error: 'Error al actualizar la actividad' });
    //     }
    // }


    public publishActivity = async (req: Request, res: Response) => {
        try {
            // Fetch activity and calculate the target date for notification
            const activity = await ActivityModel.findById(req.params.id);
            if (!activity) {
                return res.status(404).json({ error: 'Actividad no encontrada' });
            }

            const utcNow = new Date(new Date().toISOString()); // Current UTC date
            const targetDate = new Date(activity.date);
            targetDate.setDate(targetDate.getDate() - activity.daysToAnnounce);

            // Compare dates ignoring time, update if they match
            return targetDate.toISOString().slice(0, 10) === utcNow.toISOString().slice(0, 10) ?
                ActivityModel.findByIdAndUpdate(req.params.id, { activityStatus: activityStatusEnum.NOTIFICADA }, { new: true })
                    .then(updatedActivity => updatedActivity ? res.json(updatedActivity) : res.status(404).json({ error: 'Error during update' }))
                    .catch(error => res.status(500).json({ error: 'Error al actualizar la actividad' })) :
                res.status(400).json({ error: 'La actividad no cumple con la fecha para ser notificada' });
        } catch (error) {
            console.error('Error in publishing activity:', error);
            return res.status(500).json({ error: 'Error al actualizar la actividad' });
        }
}


    

}

