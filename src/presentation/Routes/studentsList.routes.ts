import { Router } from "express";
import { StudentsController } from "../../controllers/students.controller";

export class StudentsListRoutes {

    static get routes(): Router {

        const router = Router();

        const studentsController = new StudentsController();

        router.post('/uploadStudentLists', studentsController.uploadStudentList); 
        router.patch('/updateStudent/:id', studentsController.updateStudent); 
        router.get('/getAllStudentsInPeriod', studentsController.getAllStudents); 
        router.get('/getAllStudentsInPeriodByCampus', studentsController.getAllStudentsByCampus); 
        router.get('/getAllStudentsInPeriodOrderedByCampus', studentsController.getAllStudentsOrderByCampus);
        router.get('/getAllStudentsInPeriodOrderedByInstitutionId', studentsController.getAllStudentsOrderByInstitutionId);
        router.get('/getAllStudentsInPeriodOrderedByName', studentsController.getAllStudentsOrderByName);
        return router;
    }
}