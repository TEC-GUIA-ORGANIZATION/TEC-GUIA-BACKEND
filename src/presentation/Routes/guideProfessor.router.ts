import { Router } from "express";
import { GuideProfesorsController } from "../../controllers/guideProfessors.controller";


export class GuideProfesorsRoutes {
    static get routes(): Router {
        const router = Router();

        const guideProfesorsController = new GuideProfesorsController();

        router.patch('/changeStatus', guideProfesorsController.changeActiveStatusProfessor); 
        return router;
    }
}