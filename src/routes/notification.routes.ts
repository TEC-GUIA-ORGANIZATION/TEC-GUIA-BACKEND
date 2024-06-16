// notification.routes.ts

import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';

const router = Router();

router.get('/:userId', NotificationController.getUserNotifications);
router.put('/:notificationId', NotificationController.toggleReadNotification);
router.delete('/:notificationId', NotificationController.deleteNotification);

export default router;
