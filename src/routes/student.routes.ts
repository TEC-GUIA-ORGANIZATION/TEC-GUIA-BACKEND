// student.routes.ts

import { Router } from "express";
import { StudentController } from "../controllers/student.controller";
import multer from 'multer';

const router = Router();
const upload = multer({dest: 'uploads/'});

router.post('/uploadStudentLists', StudentController.uploadStudentList);
router.patch('/updateStudent/:id', StudentController.updateStudent);
router.get('/getAllStudentsInPeriod', StudentController.getAllStudents);
router.get('/getAllStudentsInPeriodByCampus', StudentController.getAllStudentsByCampus);
router.post('/upload', upload.single('file'), StudentController.saveStudentsFromExcel);
router.get('/download/:campus', StudentController.downloadStudentExcel);
router.get('/currentFirstSemesterStudents', StudentController.getCurrentFirstSemesterStudents);
router.get('/downloadAll', StudentController.downloadAllStudentsExcel);

export default router;
