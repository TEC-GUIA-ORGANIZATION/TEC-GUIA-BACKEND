import { Router } from "express";
import { StudentsController } from "../../controllers/students.controller";

export class StudentsListRoutes {

    static get routes(): Router {

        const router = Router();

        const studentsController = new StudentsController();

        router.post('/uploadStudentLists', studentsController.uploadStudentList); //* Crear
        router.patch('/updateStudent/:id', studentsController.updateStudent); //* Crear
        router.get('/getAllStudentsInPeriod', studentsController.getAllStudents); //* Crear
        router.get('/getAllStudentsInPeriodByCampus', studentsController.getAllStudentsByCampus); //* Crear
        // router.delete('/:id', activitiesController.deleteActivity); //* Eliminar
        // router.patch('/:id', activitiesController.updateActivity) //* Actualizar 
        return router;
    }
}