import { Router } from "express";
import { StudentsController } from "../../controllers/students.controller";

export class StudentsListRoutes {

    static get routes(): Router {

        const router = Router();

        const studentsController = new StudentsController();

        router.post('/uploadStudentLists', studentsController.uploadStudentList); //* Subir lista cargada de estudiantes
        router.patch('/updateStudent/:id', studentsController.updateStudent); //* Actualizar info de estudiante
        router.get('/getAllStudentsInPeriod', studentsController.getAllStudents); //* Obtener todos los estudiantes
        router.get('/getAllStudentsInPeriodByCampus', studentsController.getAllStudentsByCampus); //* Obtener todos los estudiantes por campo
        router.get('/getStudentsOrderedByAlphabeticOrder', studentsController.getStudentsOrderedByAlphabeticOrder); //* Obtener todos los estudiantes por campo
        router.get('/getStudentsOrderedByCampus', studentsController.getStudentsOrderedByCampus); //* Obtener todos los estudiantes por campo
        router.get('/getStudentsOrderedByInstitutionId', studentsController.getStudentsOrderedByInstitutionId); //* Obtener todos los estudiantes por campo
        return router;
    }
}