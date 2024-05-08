import mongoose from "mongoose";
import { Request, Response } from "express";
import { WorkoutModel } from "../presentation/Models/workout.model";

export class WorkoutsController {

    public constructor() { }

    public getWorkouts = async (req: Request, res: Response) => {
        const workouts = await WorkoutModel.find({}).sort({ createdAt: -1 });
        res.status(200).json(workouts);
    }

    public getWorkoutById = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ error: 'Workout no encontrado.' });

        const workout = await WorkoutModel.findById(id);

        return (workout === null)
            ? res.status(404).json({ error: 'No such workout' })
            : res.status(200).json(workout);
    }

    public createWorkout = async (req: Request, res: Response) => {
        const { title, load, reps } = req.body;

        let emptyFields: String[] = [];

        if (!title) {
            emptyFields.push('title');
            return res.status(400).json({ error: 'Please fill in title', emptyFields });
        }
        if (!load) {
            emptyFields.push('load');
            return res.status(400).json({ error: 'Please fill in load', emptyFields });
        }
        if (!reps) {
            emptyFields.push('reps');
            return res.status(400).json({ error: 'Please fill in reps', emptyFields });
        }
        if (emptyFields.length > 0) {
            return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
        }

        // add to the database
        try {
            const workout = await WorkoutModel.create({ title, load, reps })
            workout.save();
            res.status(200).json(workout)
        } catch (error) {
            res.status(400).json({ error: error });
        }
    }

    public deleteWorkout = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ error: 'Workout no encontrado.' });


        const workout = await WorkoutModel.findByIdAndDelete(id);

        return (workout === null)
            ? res.status(404).json({ error: 'No such workout' })
            : res.status(200).json({ mensaje: 'Workout eliminado correctamente.' });
    }

    public updateWorkout = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ error: 'Workout no encontrado.' });

        const workout = await WorkoutModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return (workout === null)
            ? res.status(400).json({ error: 'No such workout' })
            : res.status(200).json(workout);
    }
}