import { Router } from "express";
import { AuthRoutes } from "./Routes/auth.routes";
import { ActivitiesRoute } from "./Routes/activities.routes";
import { CommentsRoutes } from "./Routes/commets.routes";
import { StudentsListRoutes } from "./Routes/studentsList.routes"
import { PlanningRoutes } from "./Routes/plannings.routes";
import { UsersRoutes } from "./Routes/users.routes";
import path from "path";
import express from "express"; // Import the 'express' module

export class AppRoutes {

    static get routes(): Router {
        const router = express.Router(); // Create the router object using the 'express' module

        //router.use(express.static(path.join(__dirname, 'public'))); // Use the 'express' module to serve static files
        router.use('/api/activities', ActivitiesRoute.routes);
        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/comments', CommentsRoutes.routes);
        router.use('/api/studentList', StudentsListRoutes.routes);
        router.use('/api/planning', PlanningRoutes.routes);
        router.use('/api/users', UsersRoutes.routes);

        // router.get('*', (req, res) => {
        //     res.sendFile(path.join(__dirname, 'public', 'index.html')); // Asegúrate de que la ruta es correcta
        //   });
          

        return router;
    }
}
