import { IUser, UsuarioModel as User } from '../presentation/Models/usuario.model';
import {StudentModel as Student, IStudent} from '../presentation/Models/students.model'
import { Request, Response } from 'express';
import mongoose  from 'mongoose';


export class StudentsController {

    constructor () {}
   
    public updateStudent= async (req: Request, res: Response)=>{
        const id  = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id))
          return res.status(404).json({error: 'Estudiante no encontrado.'});
        const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
        return (!student) 
        ? res.status(400).json({error: 'No existe el estudiante'})
        : res.status(200).json(student);
    }

    public getAllStudents = async (req: Request, res: Response) => {
        const { semester, entryYear } = req.query;
        if (!semester || !entryYear) {
          return res.status(400).send('Semestre y año requeridos');
        }
        const students = await Student.find({
          semester: semester,
          entryYear: entryYear
        });
        return (!students) ? res.status(400).json({error: 'No existen usuarios cargados en el periodo actual'})
        : res.status(200).json(students);
    }


    public getAllStudentsByCampus = async (req: Request, res: Response) => {

        const { semester, entryYear, campus } = req.query;
        if (!semester || !entryYear || !campus) {
          return res.status(400).send('Semestre y año requeridos');
        }

        const students = await Student.find({
          semester: semester,
          entryYear: entryYear,
          campus: campus
        });

        return (!students) 
        ? res.status(400).json({error: 'No existen estudiantes matriculados en la sede seleccionada para este periodo'})
        : res.status(200).json(students);

    };   

    public uploadStudentList = async (req: Request, res: Response) => {
        const {studentsList} = req.body; 
        let savedStudents:IStudent[] = [];

        if (!studentsList) {
            res.status(400).json({error: 'No se encontró ningún estudiante.'})}
        for (let student of studentsList ) {
            const newStudent = await this.createStudent(student);
            !newStudent ? res.status(400).json({error: 'No existen estudiantes matriculados en la sede seleccionada para este periodo'}) 
            : savedStudents.push(newStudent);
        }
        return (savedStudents.length == 0) 
        ? res.status(400).json({error: 'No se guardó ningún estudiante.'})
        : res.status(200).json(savedStudents);
    }

    public createStudent = async (student:IStudent): Promise<IStudent> => {
        const studentExist = await Student.findOne({
                $or: [
                    { institutionId: student.institutionId },
                    { email: student.email }
        ]});
        if (!studentExist) {
            const newStudent = new Student(student);
            await newStudent.save();
            return newStudent;
        }
        throw new Error("Estudiante no pudo ser creado con éxito"); 
    }
    

}