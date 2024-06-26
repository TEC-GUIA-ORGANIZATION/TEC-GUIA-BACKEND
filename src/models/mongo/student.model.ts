// student.model.ts

import mongoose, { Document } from 'mongoose';
import { Semester } from '../../enums/semester.enum';

// Interface for the student model
export interface IStudent extends Document {
    institutionID: number;
    personalPhone: string;
    semester: string;
    entryYear: number;
    email: string;
    name: string;
    firstLastname: string;
    secondLastname: string;
    campus: string;
    photo: string;
}

// Schema for the student model
const studentSchema =  new mongoose.Schema({
    institutionID: {
        type: Number,
        required: true
    },
    personalPhone : {
        type: String,
        required: true,
        unique: true
    },
    semester: {
        type: String,
        enum: Semester,
        required: true
    },
    entryYear : {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    firstLastname: {
        type: String,
        required: true
    },
    secondLastname: {
        type: String,
        required: true
    },
    campus: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    }
});

export const Student = mongoose.model<IStudent>('Students', studentSchema);
