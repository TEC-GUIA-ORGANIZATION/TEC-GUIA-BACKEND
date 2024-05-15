import { Router } from "express";
import multer from 'multer';

import { StudentsController } from "../../controllers/students.controller";

export class StudentsListRoutes {

    static get routes(): Router {

        const router = Router();

        const studentsController = new StudentsController();
        const upload = multer({dest: 'uploads/'});

<<<<<<< HEAD
        router.post('/uploadStudentLists', studentsController.uploadStudentList); //* Crear
        router.patch('/updateStudent/:id', studentsController.updateStudent); //* Crear
        router.get('/getAllStudentsInPeriod', studentsController.getAllStudents); //* Crear
        router.get('/getAllStudentsInPeriodByCampus', studentsController.getAllStudentsByCampus); //* Crear
        // router.delete('/:id', activitiesController.deleteActivity); //* Eliminar
        // router.patch('/:id', activitiesController.updateActivity) //* Actualizar 
        router.post('/upload', upload.single('file'), studentsController.saveStudentsFromExcel);
=======
        router.post('/uploadStudentLists', studentsController.uploadStudentList); //* Subir lista cargada de estudiantes
        router.patch('/updateStudent/:id', studentsController.updateStudent); //* Actualizar info de estudiante
        router.get('/getAllStudentsInPeriod', studentsController.getAllStudents); //* Obtener todos los estudiantes
        router.get('/getAllStudentsInPeriodByCampus', studentsController.getAllStudentsByCampus); //* Obtener todos los estudiantes por campo
        router.get('/getStudentsOrderedByAlphabeticOrder', studentsController.getAllStudentsOrderByName); //* Obtener todos los estudiantes por campo
        router.get('/getStudentsOrderedByCampus', studentsController.getAllStudentsOrderByCampus); //* Obtener todos los estudiantes por campo
        router.get('/getStudentsOrderedByInstitutionId', studentsController.getAllStudentsOrderByInstitutionId); //* Obtener todos los estudiantes por campo
>>>>>>> 874a3568c46af1348bcc5ce0b1be6d48306663a2
        return router;
    }
}