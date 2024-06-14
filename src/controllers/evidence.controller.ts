// evidence.controller.ts

import { Request, Response } from 'express';
import { Activity } from '../models/activity.model';

export class EvidenceController {

    public static record = async (req: Request, res: Response) => {
        try {
            const activity = await Activity.findById(req.params.activityId);
            if (!activity) return res.status(404).json({ error: 'Actividad no encontrada' });

            const updatedActivity = await Activity.findByIdAndUpdate(
                req.params.activityId,
                // Update the recording link inside the evidence object
                { 'evidence.recordingLink': req.body.recordingLink },
                { new: true }
            );

            return (!updatedActivity)
                ? res.status(404).json({ error: 'Actividad no encontrada' })
                : res.json(updatedActivity);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la actividad' });
        }
    }

    public static attendance = async (req: Request, res: Response) => {
        try {
            const activity = await Activity.findById(req.params.activityId);
            if (!activity) return res.status(404).json({ error: 'Actividad no encontrada' });

            const updatedActivity = await Activity.findByIdAndUpdate(
                req.params.activityId,
                // Update the attendance array inside the evidence object
                { $push: { 'evidence.attendance': req.body.attendance } },
                { new: true }
            );

            return (!updatedActivity)
                ? res.status(404).json({ error: 'Actividad no encontrada' })
                : res.json(updatedActivity);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la actividad' });
        }
    }

    public static participants = async (req: Request, res: Response) => {
        try {
            const activity = await Activity.findById(req.params.activityId);
            if (!activity) return res.status(404).json({ error: 'Actividad no encontrada' });

            const updatedActivity = await Activity.findByIdAndUpdate(
                req.params.activityId,
                // Update the participants array inside the evidence object
                { $push: { 'evidence.participants': req.body.participants } },
                { new: true }
            );

            return (!updatedActivity)
                ? res.status(404).json({ error: 'Actividad no encontrada' })
                : res.json(updatedActivity);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la actividad' });
        }
    }

    public static deleteAttendance = async (req: Request, res: Response) => {
        try {
            const { activityId, position } = req.params;

            const activity = await Activity.findById(activityId);
            if (!activity) return res.status(404).json({ error: 'Actividad no encontrada' });

            var elementToDelete = activity.evidence?.attendance[Number(position)];
            if (!elementToDelete) return res.status(404).json({ error: 'Elemento no encontrado' });

            const updatedActivity = await Activity.findByIdAndUpdate(
                activityId,
                // Remove the attendance element from the evidence object
                { $pull: { 'evidence.attendance': elementToDelete } },
                { new: true }
            );

            return (!updatedActivity)
                ? res.status(404).json({ error: 'Actividad no encontrada' })
                : res.json(updatedActivity);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la actividad' });
        }
    }

    public static deleteParticipant = async (req: Request, res: Response) => {
        try {
            const { activityId, position } = req.params;

            const activity = await Activity.findById(activityId);
            if (!activity) return res.status(404).json({ error: 'Actividad no encontrada' });

            var elementToDelete = activity.evidence?.participants[Number(position)];
            if (!elementToDelete) return res.status(404).json({ error: 'Elemento no encontrado' });

            const updatedActivity = await Activity.findByIdAndUpdate(
                activityId,
                // Remove the participant element from the evidence object
                { $pull: { 'evidence.participants': elementToDelete } },
                { new: true }
            );

            return (!updatedActivity)
                ? res.status(404).json({ error: 'Actividad no encontrada' })
                : res.json(updatedActivity);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la actividad' });
        }
    }
}
