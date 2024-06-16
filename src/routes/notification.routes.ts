// notification.routes.ts

import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';

const router = Router();

router.get('/notifications/:userId', NotificationController.getUserNotifications);
router.put('/notification/:notificationId', NotificationController.toggleReadNotification);
router.delete('/notification/:notificationId', NotificationController.deleteNotification);

export default router;
