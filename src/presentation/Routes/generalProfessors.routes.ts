import { Router } from "express";
import { GeneralProfessorsController } from '../../controllers/generalProfessor.controller';



export class GeneralProfessorsRoutes {
    static get routes(): Router {
        const router = Router();

        const  generalProfessorsController = new GeneralProfessorsController();

        router.get('/getProfessorInfo', generalProfessorsController.getProfessorInfo);
        router.get('/getAllProfessors', generalProfessorsController.getProfessorsFromGuideTeam);
        router.patch('/updateProfessorPhoto', generalProfessorsController.updateProfessorPhoto);
        router.patch('/updateProfessor/:id',generalProfessorsController.updateProfessor);
        router.post('/createProfessor',generalProfessorsController.createProfessor);
        
        


        return router;
    }
}