import { Router } from "express";
import { AuthRoutes } from "./Routes/auth.routes";
import { ActivitiesRoute } from "./Routes/activities.routes";
import { CommentsRoutes } from "./Routes/commets.routes";
import { StudentsListRoutes } from "./Routes/studentsList.routes"
import { PlanningRoutes } from "./Routes/plannings.routes";
import { UsersRoutes } from "./Routes/users.routes";
import { GuideProfesorsRoutes } from "./Routes/guideProfessor.routes";
import { EvidenceRoutes } from "./Routes/evidence.routes";
import { GeneralProfessorsRoutes } from "./Routes/generalProfessors.routes";

export class AppRoutes {

    static get routes(): Router {
        const router = Router(); // Create the router object using the 'express' module

        router.use('/api/activities', ActivitiesRoute.routes);
        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/comments', CommentsRoutes.routes);
        router.use('/api/studentList', StudentsListRoutes.routes);
        router.use('/api/planning', PlanningRoutes.routes);
        router.use('/api/users', UsersRoutes.routes);
        router.use('/api/guideProfessors', GuideProfesorsRoutes.routes);
        router.use('/api/evidence', EvidenceRoutes.routes);
        router.use('/api/generalProfessors', GeneralProfessorsRoutes.routes);

        return router;
    }
}
