import { Request, Response } from "express";
import mongoose from 'mongoose';
import { IGuideProfessor, ProfesorGuiaModel } from '../presentation/Models/profesorGuia.model';
import { AdminAssistantModel } from "../presentation/Models/asistenteAdministrador.model";
import { rol } from '../utils/rol.enum';
import { UsuarioModel } from "../presentation/Models/usuario.model";

export class GeneralProfessorsController {

    constructor () {};

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
        return Object.values(rol).includes(role as rol);
    }
    

    public getProfessorsFromGuideTeam = async (req: Request, res: Response) => {
        try {
            const allowedRoles = [rol.ADMIN, rol.COORDINADOR, rol.PROFESOR_GUIA];
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

}