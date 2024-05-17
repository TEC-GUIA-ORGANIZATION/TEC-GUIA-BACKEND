import { Router } from "express";
import { PlanningController } from "../../controllers/planning.controller";


export class PlanningRoutes {
    static get routes(): Router {
        const router = Router();

        const planningController = new PlanningController();

        router.post('/', planningController.createPlanning); 
        router.get('/getPlanningBySemester', planningController.getPlannings); 
        router.get('/getByCampus', planningController.getPlanningByCampus);
        router.get('/getById', planningController.getPlanningById);
        router.get('/getActivitiesOfPlanning', planningController.getActivitiesByPlanning); 
        router.get('/activities/:id', planningController.getActivitiesByPlanningId);
        router.get('/getNextActivity', planningController.getNextActivity);
        return router;
    }
}