// planning.model.ts

import mongoose from 'mongoose';
import { IActivity } from './activity.model';
import { Semester } from '../enums/semester.enum';
import { Campus } from '../enums/campus.enum';

// Planning interface
// This interface defines the structure of a planning
export interface IPlanning extends Document {
    year: Number;
    semester: String;
    activities? : IActivity[];
    campus: String;
}

// Planning schema
// This schema defines the structure of a planning
const PlanningSchema = new mongoose.Schema<IPlanning>({
    year: {
      type: Number,
      required: true,  
    },
    semester: {
      type: String,
      enum: Semester,
      required: true,  
    },
    activities: [
     { type: mongoose.Schema.Types.ObjectId, ref: 'Actividades' } 
    ],
    campus : {
      type: String,
      enum: Campus,
      required: true,  
    },
})

export const Planning = mongoose.model('Planning', PlanningSchema);
