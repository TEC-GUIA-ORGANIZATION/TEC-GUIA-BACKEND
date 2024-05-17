import { Router } from "express";

import { EvidenceController } from "../../controllers/evidence.controller";

export class EvidenceRoutes {

    static get routes(): Router {

        const router = Router();

        const evidenceController = new EvidenceController();

        router.post('/record/:activityId', evidenceController.record);
        router.post('/attendance/:activityId', evidenceController.attendance);
        router.post('/participants/:activityId', evidenceController.participants);
        router.delete('/attendance/:activityId/:position', evidenceController.deleteAttendance);
        router.delete('/participants/:activityId/:position', evidenceController.deleteParticipant);

        return router;
    }
}
