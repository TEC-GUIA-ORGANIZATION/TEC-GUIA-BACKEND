// activity.routes.ts

import { Router } from 'express';
import { ActivitiesController } from '../controllers/activity.controller';

const router = Router();

router.get('/', ActivitiesController.getActivities); // Get all activities
router.get('/:id', ActivitiesController.getActivityById); // Get an activity by ID
router.post('/', ActivitiesController.createActivity); // Create a new activity
router.patch('/:id', ActivitiesController.updateActivity) // Update an activity
router.delete('/:id', ActivitiesController.deleteActivity); // Delete an activity
router.patch('/cancel/:id', ActivitiesController.cancelActivity); // Cancel an activity
router.get('/nexActivity', ActivitiesController.getNextActivity); // Get the next upcoming activity
router.patch('/markAsCompleted/:id', ActivitiesController.markActivityAsCompleted) // Mark an activity as completed
router.post('/:id/poster', ActivitiesController.uploadPoster); // Upload a poster

export default router;
