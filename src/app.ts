// app.ts

import express, { Application } from 'express';
import cors from './middlewares/cors.middleware';
import routes from './app.routes';
import { mongoConnect } from './config/mongo';
import * as APP_CONFIG from './app.config';

// Connect to MongoDB
mongoConnect();

// Create express app
const app: Application = express();

app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

// Enable CORS
app.use(cors);

// Static files
app.use(express.static(APP_CONFIG.APP.public_path));

// Set routes
app.use(routes);

app.listen(APP_CONFIG.APP.port, () => {
    console.log(`Server running on port ${APP_CONFIG.APP.port}`);
})
