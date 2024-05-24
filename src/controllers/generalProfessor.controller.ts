import { Request, Response } from "express";
import mongoose from 'mongoose';
import { IGuideProfessor, ProfesorGuiaModel } from '../presentation/Models/profesorGuia.model';
import { AdminAssistantModel } from "../presentation/Models/asistenteAdministrador.model";
import { rol } from '../utils/rol.enum';
import { UsuarioModel } from "../presentation/Models/usuario.model";

export class GeneralProfessorsController {

    constructor () {};
    public createProfessor = async (req: Request, res: Response) => {
        try {
            const {
                email,
                password,
                name,
                firstLastname,
                secondLastname,
                campus,
                photo,
                rol,
                userType,
                officePhone,
                personalPhone,
                isCoordinator,
                isActive
            } = req.body;
            const professorsCampus=await ProfesorGuiaModel.find({campus});
            const amountOfProfessors=professorsCampus.length;
            var code="";
            switch(campus){
                case "Cartago":
                    code="CA"
                    break;
                case "Alajuela":
                    code="AL"
                    break;
                case "San Jose":
                    code="SJ"
                    break;
                case "San Carlos":
                    code="SC"
                    break;
                case "Limon":
                    code="LI"
                    break;
            }
            if(amountOfProfessors<=8){
                code=code+"0"+(amountOfProfessors+1).toString();
            }
            else{
                code=code+(amountOfProfessors+1).toString();
            }
            
            // Verificar si el profesor ya existe
            const profesorExist = await ProfesorGuiaModel.findOne({ email });
            if (profesorExist) {
                return res.status(400).json({ message: "El profesor ya existe" });
            }
    
            // Crear una nueva instancia del modelo con los datos recibidos
            const newProfesor = new ProfesorGuiaModel({
                email,
                password,
                name,
                firstLastname,
                secondLastname,
                campus,
                photo,
                rol,
                userType,
                code,
                officePhone,
                personalPhone,
                isCoordinator,
                isActive
            });
    
            // Guardar el nuevo profesor en la base de datos
            await newProfesor.save();
    
            // Devolver el profesor creado como respuesta
            return res.status(201).json(newProfesor);
        } catch (error) {
            console.error('Error al crear el profesor:', error);
            return res.status(500).json({ message: "Profesor no pudo ser creado con éxito" });
        }
    }
    public getProfessorInfo = async (req: Request, res: Response) => {
        const { professorId } = req.query;
        // Validate the input
        if (!professorId) {
            return res.status(400).json({ error: "El id del profesor es requerido para realizar esta acción" });
        }
        try {
            // Retrieve the active professor
            const professor = await UsuarioModel.findOne({ _id: professorId});
            // Check if the professor exists and has the correct role
            if (!professor || !this.isValidRole(professor.rol)) {
                return res.status(404).json({ error: "Profesor no encontrado" });
            } else {
                // Send the professor's information
                return res.status(200).json({ message: "Info de profesor enviada correctamente", data: professor });
            }
        } catch (error) {
            return res.status(500).json({ error: "Ocurrió un error al obtener la información del profesor" });
        }
    };

    private isValidRole(role: any): role is rol {
        // Get all roles except for 'ESTUDIANTE'
        const validRoles = Object.values(rol).filter(r => r !== rol.ESTUDIANTE);
        return validRoles.includes(role as rol);
    }
    

    public getProfessorsFromGuideTeam = async (req: Request, res: Response) => {
        try {
            const allowedRoles = [rol.COORDINADOR, rol.PROFESOR_GUIA];
            const professors = await UsuarioModel.find({ rol: { $in: allowedRoles } });

            // Check if the professor exists
            if (!professors) {
                res.status(404).json({ error: "Profesores no se encontraron" });
            } else {
                // Send the professor's information
                return res.status(200).json({ message: "Info de profesores enviada correctamente", data: professors });
            }
        } catch (error) {
            return res.status(500).json({ error: "Ocurrió un error al obtener la información de los profesores" });
        }
    };
    public updateProfessor = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id))
          return res.status(404).json({ error: 'Profesor no encontrado.' });
        const student = await ProfesorGuiaModel.findByIdAndUpdate(id, req.body, { new: true });
        return (!student)
          ? res.status(400).json({ error: 'No existe el profesor' })
          : res.status(200).json(student);
      }
    public updateProfessorPhoto = async (req: Request, res: Response) => {
        const { userId } = req.query;
        const { photoUrl} = req.body;
        // Validate the input
        if (!userId || !photoUrl) {
            return res.status(400).json({ error: "Both user ID and photo URL are required." });
        }

        try {
            // Update the photo URL for the specified user ID
            const updated = await UsuarioModel.findByIdAndUpdate(
                userId,
                { photo: photoUrl },
                { new: true }  // Returns the updated document
            );

            // Check if the document was found and updated
            if (!updated || !this.isValidRole(updated.rol)) {
                return res.status(404).json({ error: "Usuario no encontrado o no actualizado." });
            } else {
                return res.status(200).json({
                    message: "Foto de profesor actualizada correctamente.",
                    data: updated
                });
            }
        } catch (error) {
            return res.status(500).json({ error: "Ocurrió un error al actualizar la foto del profesor." });
        }
    };

}
