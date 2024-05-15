import mongoose from 'mongoose';
import { IActivity, ActivityModel as Model } from './activities.model';
import { semester } from '../../utils/semesters';
import { StringifyOptions } from 'querystring';
import { campus } from '../../utils/campus';


export interface IPlanning extends Document {
    year: Number;
    semester: String;
    activities? : IActivity[];
    campus: String;
}

const PlanningSchema = new mongoose.Schema<IPlanning>({
    year: {
      type: Number,
      required: true,  
    },
    semester: {
      type: String,
      enum: semester,
      required: true,  
    },
    activities: [
     { type: mongoose.Schema.Types.ObjectId, ref: 'Actividades' } 
    ],
    campus : {
      type: String,
      enum: campus,
      required: true,  
    },
})

export const PlanningModel = mongoose.model('Planning', PlanningSchema);