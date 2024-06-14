// evidence.routes.ts

import { Router } from 'express';
import { EvidenceController } from '../controllers/evidence.controller';

const router = Router();

router.post('/record/:activityId', EvidenceController.record);
router.post('/attendance/:activityId', EvidenceController.attendance);
router.post('/participants/:activityId', EvidenceController.participants);
router.delete('/attendance/:activityId/:position', EvidenceController.deleteAttendance);
router.delete('/participants/:activityId/:position', EvidenceController.deleteParticipant);

export default router;
