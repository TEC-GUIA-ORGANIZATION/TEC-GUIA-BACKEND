import { Request, Response } from "express";
import mongoose from 'mongoose';
import { ProfesorGuiaModel } from '../presentation/Models/profesorGuia.model';
import { rol } from '../utils/rol.enum';

export class GuideProfesorsController {


    

    public changeActiveStatusProfessor = async (req: Request, res: Response) => {
        const { professorId, campus } = req.body;

        // Validate required fields
        if (!professorId || !campus) {
            return res.status(400).json({ error: "Profesor ID y campus son requeridos" });
        }

        try {
            // Find the professor using ID and campus
            const professorToBeActivated = await ProfesorGuiaModel.findOne({
                _id: professorId,
                campus
            });

            if (!professorToBeActivated) {
                return res.status(404).json({ error: "Profesor no encontrado." });
            } else {
                // Toggle the isActive status
                const updatedProfessor = await ProfesorGuiaModel.findByIdAndUpdate(
                    professorId,
                    { $set: { isActive: !professorToBeActivated.isActive } },
                    { new: true }
                );

                if (!updatedProfessor) {
                    return res.status(500).json({ error: "Fallo la actualización del profesor" });
                }

                // Respond with the updated professor info
                res.status(200).json({ message: "Estado de profesor actualizado correctamente", updatedProfessor });
            }
        } catch (error) {
            console.error("Error cambiando estatus ", error);
            res.status(500).json({ error: "An error occurred while changing the active status of the professor." });
        }
    };

    
    public setCoordinator = async (req: Request, res: Response): Promise<void> => {
        const { campus, newCoordinatorId } = req.body;
    
        try {
            // Find the current coordinator
            const currentCoordinator = await ProfesorGuiaModel.findOne({
                rol: rol.COORDINADOR,
                campus: campus
            });
            // Set all professors in the campus to not be coordinators
            await ProfesorGuiaModel.updateMany(
                { campus: campus },
                { $set: { isCoordinator: false, rol: rol.PROFESOR_GUIA } }
            );
            // Set the new coordinator
            const newCoordinator = await ProfesorGuiaModel.findOneAndUpdate(
                {_id: newCoordinatorId,
                  campus: campus
                },
                { $set: { isCoordinator: true, rol: rol.COORDINADOR } },
                { new: true }
            );
            // If the new coordinator could not be set
            if (!newCoordinator) {
                if (currentCoordinator) {
                    // Restore the previous coordinator if setting the new one failed
                    await ProfesorGuiaModel.findByIdAndUpdate(
                        currentCoordinator._id,
                        { $set: { isCoordinator: true, rol: rol.COORDINADOR } }
                    );
                }
                res.status(500).json({
                    error: "Error al asignar nuevo coordinador",
                    message: "No se encontró el nuevo coordinador y el anterior ha sido restablecido."
                });
            } else {
            await newCoordinator?.save();
            // Successfully updated the coordinator
            res.status(200).json({
                message: 'Coordinador asignado correctamente',
                newCoordinator
            });
            }
        } catch (error) {
            console.error("Error setting coordinator:", error);
            res.status(500).json({ error: "Ocurrió un error al actualizar el coordinador" });
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
            const professor = await ProfesorGuiaModel.findOne({ _id: professorId, isActive: true }); 
            // Check if the professor exists
            if (!professor) {
                res.status(404).json({ error: "Profesor no encontrado" });
            } else {
                // Send the professor's information
                return res.status(200).json({ message: "Info de profesor enviada correctamente", data: professor });
            }
        } catch (error) {
            return res.status(500).json({ error: "Ocurrió un error al obtener la información del profesor" });
        }
    };

        public getProfessorsFromGuideTeam = async (req: Request, res: Response) => {
            try {
            
                const professors = await ProfesorGuiaModel.find({}); 
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