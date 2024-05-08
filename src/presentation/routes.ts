import { Router } from "express";
import { AuthRoutes } from "./Routes/auth.routes";
import { ActivitiesRoute } from "./Routes/activities.routes";

export class AppRoutes {

    static get routes(): Router {
        
        const router = Router();

        router.use('/api/activities', ActivitiesRoute.routes);
        router.use('/api/auth', AuthRoutes.routes);

        return router;
    }
}