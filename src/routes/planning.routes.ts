// planning.routes.ts

import { Router } from 'express';
import { PlanningController } from '../controllers/planning.controller';

const router = Router();

router.post('/', PlanningController.createPlanning); 
router.get('/getById', PlanningController.getPlanningById);
router.get('/getActivitiesOfPlanning', PlanningController.getActivitiesByPlanning); 
router.get('/getNextActivity', PlanningController.getNextActivity);

export default router;
