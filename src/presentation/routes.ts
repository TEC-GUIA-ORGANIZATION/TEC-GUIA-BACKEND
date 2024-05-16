import { Router } from "express";
import { AuthRoutes } from "./Routes/auth.routes";
import { ActivitiesRoute } from "./Routes/activities.routes";
import { CommentsRoutes } from "./Routes/commets.routes";
import { StudentsListRoutes } from "./Routes/studentsList.routes"
import { PlanningRoutes } from "./Routes/plannings.routes";
import { UsersRoutes } from "./Routes/users.routes";

export class AppRoutes {

    static get routes(): Router {
        
        const router = Router();

        router.use('/api/activities', ActivitiesRoute.routes);
        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/comments', CommentsRoutes.routes);
        router.use('/api/studentList', StudentsListRoutes.routes);
        router.use('/api/planning', PlanningRoutes.routes);
        router.use('/api/users', UsersRoutes.routes);

        return router;
    }
}
