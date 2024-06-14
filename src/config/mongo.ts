// mongo.config.ts

import mongoose from 'mongoose';
import { MONGO_DB } from '../app.config';

// MongoDB Connection
export const mongoConnect = async () => {
    try {
        await mongoose.connect(MONGO_DB.uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error', error);
    }
}
