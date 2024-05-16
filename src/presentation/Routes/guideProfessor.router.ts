import { Router } from "express";
import { GuideProfesorsController } from "../../controllers/guideProfessors.controller";


export class GuideProfesorsRoutes {
    static get routes(): Router {
        const router = Router();

        const guideProfesorsController = new GuideProfesorsController();

        router.patch('/changeStatus', guideProfesorsController.changeActiveStatusProfessor); 
        router.patch('/setCoordinator', guideProfesorsController.setCoordinator);
        router.get('/getProfessorInfo', guideProfesorsController.getProfessorInfo);
        router.get('/getAllGuideProfessors', guideProfesorsController.getProfessorsFromGuideTeam);
        return router;
    }
}