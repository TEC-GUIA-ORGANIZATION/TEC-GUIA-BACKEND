import { Router } from "express";
import { PlanningController } from "../../controllers/planning.controller";


export class PlanningRoutes {
    static get routes(): Router {
        const router = Router();

        const planningController = new PlanningController();

        router.post('/', planningController.createPlanning); 
        router.get('/', planningController.getPlannings); 
        router.get('/getByCampus', planningController.getPlanningByCampus); 
        return router;
    }
}