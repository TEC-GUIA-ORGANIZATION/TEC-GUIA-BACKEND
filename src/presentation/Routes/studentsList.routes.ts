import { Router } from "express";
import multer from 'multer';

import { StudentsController } from "../../controllers/students.controller";

export class StudentsListRoutes {

    static get routes(): Router {

        const router = Router();

        const studentsController = new StudentsController();
        const upload = multer({dest: 'uploads/'});

        router.post('/uploadStudentLists', studentsController.uploadStudentList); //* Crear
        router.patch('/updateStudent/:id', studentsController.updateStudent); //* Crear
        router.get('/getAllStudentsInPeriod', studentsController.getAllStudents); //* Crear
        router.get('/getAllStudentsInPeriodByCampus', studentsController.getAllStudentsByCampus); //* Crear
        router.post('/upload', upload.single('file'), studentsController.saveStudentsFromExcel);
        return router;
    }
}
