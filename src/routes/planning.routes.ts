// planning.routes.ts

import { Router } from 'express';
import { PlanningController } from '../controllers/planning.controller';

const router = Router();

router.post('/', PlanningController.createPlanning); 
router.get('/getPlanningBySemester', PlanningController.getPlannings); 
router.get('/getByCampus', PlanningController.getPlanningByCampus);
router.get('/getById', PlanningController.getPlanningById);
router.get('/getActivitiesOfPlanning', PlanningController.getActivitiesByPlanning); 
router.get('/activities/:id', PlanningController.getActivitiesByPlanningId);
router.get('/getNextActivity', PlanningController.getNextActivity);

export default router;
