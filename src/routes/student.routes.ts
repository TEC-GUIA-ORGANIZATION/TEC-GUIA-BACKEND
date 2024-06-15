// student.routes.ts

import { Router } from "express";
import { StudentController } from "../controllers/student.controller";
import multer from 'multer';

const router = Router();
const upload = multer({dest: 'uploads/'});


router.patch('/updateStudent/:id', StudentController.updateStudent);
router.get('/getAllStudentsInPeriod', StudentController.getAllStudents);
router.get('/wrapped/:id', StudentController.getWrappedStudentById);
router.post('/upload', upload.single('file'), StudentController.saveStudentsFromExcel);
router.get('/download/:campus', StudentController.downloadStudentExcel);
router.get('/current-semester', StudentController.getCurrentSemesterStudents);
router.get('/downloadAll', StudentController.downloadAllStudentsExcel);

export default router;
