// professor.routes.ts

import { Router } from "express";
import { ProfessorController } from "../controllers/professor.controller";

const router = Router();

router.get('/getProfessorInfo', ProfessorController.getProfessorInfo);
router.get('/getAllProfessors', ProfessorController.getProfessorsFromGuideTeam);
router.patch('/updateProfessorPhoto', ProfessorController.updateProfessorPhoto);
router.patch('/changeStatus', ProfessorController.changeActiveStatusProfessor); 
router.patch('/setCoordinator', ProfessorController.setCoordinator);

export default router;
