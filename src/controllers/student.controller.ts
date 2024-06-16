// student.controller.ts

import { IStudent, Student } from '../models/mongo/student.model';
import { Campus } from '../enums/campus.enum';
import { Request, Response } from 'express';
import xlsx from 'xlsx';
import mongoose from 'mongoose';
import { AuthenticableWrapper, IAuthenticableWrapper, encryptPassword } from '../models/mongo/student-wrapper.model';
import { Mailbox } from '../models/mongo/mailbox.model';
import { Program } from '../services/program.service';

// Student controller class
// This class contains methods to handle the students
export class StudentController{

    /**
     * Get the current semester students
     * @param req - Express Request object
     * @param res - Express Response object
     * @returns Response object with the students or error message
     */
    private static getSemesterFromDate(date: Date): string {
        return (date.getMonth() + 1) >= 1 && (date.getMonth() + 1) <= 6 ? "primer semestre" : "segundo semestre";
    }

    /**
     * Get the current semester students 
     * @param req - Express Request object 
     * @param res - Express Response object 
     * @returns Response object with the students or error message
     */
    public static getCurrentSemesterStudents = async (req: Request, res: Response) => {
        const semester: string = StudentController.getSemesterFromDate(new Date());
        const currentYear: number = new Date().getFullYear();

        const students = await Student.find({
            semester: semester,
            entryYear: currentYear
        });

        return students && students.length > 0
            ? res.status(200).json(students)
            : res.status(400).json({ error: 'No existen usuarios cargados en el periodo actual' });
    }

    /**
     * Get a student by ID
     * @param req - Express Request object
     * @param res - Express Response object
     * @returns Response object with the student or error message
     */
    public static getWrappedStudentById = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ error: 'Estudiante no encontrado.' });

        const studentUser = await AuthenticableWrapper.findById(id);
        if (!studentUser) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const student = await Student.findById(studentUser.student);
        return (!student)
            ? res.status(400).json({ error: 'No existe el estudiante' })
            : res.status(200).json(student);
    }

    /**
     * Update a student
     * @param req - Express Request object
     * @param res - Express Response object
     * @returns Response object with the new student or error message
     */
    public static updateStudent = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ error: 'Estudiante no encontrado.' });
        const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
        return (!student)
            ? res.status(400).json({ error: 'No existe el estudiante' })
            : res.status(200).json(student);
    }

    public static getAllStudents = async (req: Request, res: Response) => {
        const { semester, entryYear } = req.query;
        if (!semester || !entryYear) {
            return res.status(400).send('Semestre y año requeridos');
        }
        const students = await Student.find({
            semester: semester,
            entryYear: entryYear
        });
        return (!students) ? res.status(400).json({ error: 'No existen usuarios cargados en el periodo actual' })
            : res.status(200).json(students);
    }

    /**
     * Create a new student
     * @param req - Express Request object 
     * @param res - Express Response object 
     * @returns Response object with the students or error message 
     */
    public static createStudent = async (student: IStudent): Promise<IAuthenticableWrapper | undefined> => {
        try {
            
            const studentExist = await Student.findOne({
                $or: [
                    { institutionID: student.institutionID },
                    { email: student.email }
                ]
            });

            if (!studentExist) {
                const newStudent = await Student.create({
                    institutionID: student.institutionID, 
                    personalPhone: student.personalPhone, 
                    semester: student.semester, 
                    entryYear: student.entryYear, 
                    email: student.email, 
                    name: student.name, 
                    firstLastname: student.firstLastname, 
                    secondLastname: student.secondLastname, 
                    campus: student.campus, 
                    photo: student.photo});
                await newStudent.save();
                const pass = await encryptPassword(student.institutionID.toString());
                const mailbox = await Mailbox.create({});
                const newStudentWrapper = new AuthenticableWrapper({
                    student: newStudent,
                    password: pass,
                    rol: "estudiante",
                    status: true,
                    mailbox: mailbox
                });
                
                await newStudentWrapper.save();
                return newStudentWrapper;
            }
        } catch (error) {
            console.error('Error creating student:', error);
        }
        return undefined; // Explicitly return undefined if the student already exists or an error occurs
    }

    /**
     * Save students from an Excel file
     * @param req - Express Request object 
     * @param res - Express Response object 
     * @returns Response object with the students or error message 
     */
    public static saveStudentsFromExcel = async (req: Request, res: Response) => {
        const campus: Campus = req.body.campus;

        if (!req.file)
            return res.status(400).send('No file uploaded');

        const filePath = req.file.path;

        try {
            const workBook = xlsx.readFile(filePath);
            const sheetName = workBook.SheetNames[0];
            const workSheet = workBook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json<any>(workSheet);
            var studentsCreated: IStudent[] = [];
            const students: any = data.map((student: any) => ({
                name: student.name,
                firstLastname: student.firstLastname,
                secondLastname: student.secondLastname,
                photo: student.photo,
                institutionID: student.institutionID,
                email: student.email,
                campus: student.campus,
                personalPhone: student.personalPhone,
                semester: student.semester,
                entryYear: student.entryYear,
            }));
            for (let student of students) {

                const newStudent = await this.createStudent(student);
                if (newStudent) {
                    studentsCreated.push(newStudent.student);
                    Program.getInstance().addStudent(newStudent);
                }
            }

            const studentsToDelete=await Student.find({ campus: campus });
            if (studentsToDelete.length > 0) {
                for (let student of studentsToDelete) {
                    await Student.deleteOne({ _id: student._id });
                    await AuthenticableWrapper.deleteOne({ student: student._id });
                }
            }
            
            
            for (let student of studentsCreated) {
                await this.createStudent(student);
            }
            console.log("Estudiante subido adecuadamente");
            res.status(200).send('Estudiante subido adecuadamente.')
        } catch (error) {
            console.log(error);
            res.status(500).send('Error processing file.');
        }
    }

    /**
     * Download students as an Excel file
     * @param req - Express Request object 
     * @param res - Express Response object 
     * @returns Response object with the students or error message 
     */
    public static downloadStudentExcel = async (req: Request, res: Response) => {
        const { campus } = req.params;

        try {
            const students = await Student.find({ campus }).exec();

            if (students.length === 0) {
                return res.status(404).json({ message: 'No students found for the selected campus.' });
            }

            const studentData: any[] = students.map((student: IStudent) => ({
                email: student.email,
                name: student.name,
                firstLastname: student.firstLastname,
                secondLastname: student.secondLastname,
                campus: student.campus,
                institutionID: student.institutionID,
                personalPhone: student.personalPhone,
                semester: student.semester,
                entryYear: student.entryYear,
            }));

            const worksheet = xlsx.utils.json_to_sheet(studentData);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Students');

            const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            res.setHeader('Content-Disposition', 'attachment; filename="students.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        } catch (error) {
            console.error('Error fetching students or generating Excel:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    /**
     * Download all students as an Excel file
     * @param req - Express Request object 
     * @param res - Express Response object 
     * @returns Response object with the students or error message 
     */
    public static downloadAllStudentsExcel = async (req: Request, res: Response) => {
        try {
            const students = await Student.find().exec();

            if (students.length === 0) {
                return res.status(404).json({ message: 'No students found.' });
            }

            // Organizar a los estudiantes por campus
            const studentsByCampus: { [key: string]: IStudent[] } = {};
            students.forEach((student: IStudent) => {
                if (!studentsByCampus[student.campus]) {
                    studentsByCampus[student.campus] = [];
                }
                studentsByCampus[student.campus].push(student);
            });

            const workbook = xlsx.utils.book_new();

            // Crear una hoja por cada campus
            for (const campus in studentsByCampus) {
                const studentData = studentsByCampus[campus].map((student: IStudent) => ({
                    email: student.email,
                    name: student.name,
                    firstLastname: student.firstLastname,
                    secondLastname: student.secondLastname,
                    campus: student.campus,
                    institutionID: student.institutionID,
                    personalPhone: student.personalPhone,
                    semester: student.semester,
                    entryYear: student.entryYear,
                }));

                const worksheet = xlsx.utils.json_to_sheet(studentData);
                xlsx.utils.book_append_sheet(workbook, worksheet, campus);
            }

            const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            res.setHeader('Content-Disposition', 'attachment; filename="allStudents.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        } catch (error) {
            console.error('Error fetching students or generating Excel:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
