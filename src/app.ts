// app.ts

import express, { Application } from 'express';
import cors from './middlewares/cors.middleware';
import routes from './app.routes';
import { mongoConnect } from './config/mongo';
import { Program } from './services/program.service';
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

// Create a new program
const program = Program.getInstance();
program.updateDate(APP_CONFIG.SYSTEM_DATE.date); // Update the date

// Sleep for 5 seconds
setTimeout(() => {
    // Run the program
    console.log('Running automation program...');
    program.run();
}, 5000);
