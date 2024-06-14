// professor.controller.ts

import { Request, Response } from 'express';
import { GuideProfessor } from '../models/guide-professor.model';
import { User } from '../models/user.model';
import { Role } from '../enums/role.enum';

// Professor controller class
// This class contains methods to handle the professors
export class ProfessorController {

    /**
     * Get professor information
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static getProfessorInfo = async (req: Request, res: Response) => {
        const { professorId } = req.query;
        // Validate the input
        if (!professorId) {
            return res.status(400).json({ error: "El id del profesor es requerido para realizar esta acción" });
        }
        try {
            // Retrieve the active professor
            const professor = await User.findOne({ _id: professorId});
            // Check if the professor exists and has the correct role
            if (!professor || !ProfessorController.isValidRole(professor.rol)) {
                return res.status(404).json({ error: "Profesor no encontrado" });
            } else {
                // Send the professor's information
                return res.status(200).json({ message: "Info de profesor enviada correctamente", data: professor });
            }
        } catch (error) {
            return res.status(500).json({ error: "Ocurrió un error al obtener la información del profesor" });
        }
    };

    /**
     * Check if the role is valid 
     * @param role - The role to be checked
     * @returns True if the role is valid, false otherwise
     */
    private static isValidRole(role: any): role is Role {
        // Get all roles except for 'ESTUDIANTE'
        const validRoles = Object.values(Role).filter(r => r !== Role.ESTUDIANTE);
        return validRoles.includes(role as Role);
    }

    /**
     * Get all professors from the guide team
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static getProfessorsFromGuideTeam = async (req: Request, res: Response) => {
        try {
            const allowedRoles = [Role.COORDINADOR, Role.PROFESOR_GUIA];
            const professors = await User.find({ rol: { $in: allowedRoles } });

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

    /**
     * Update professor information
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static updateProfessorPhoto = async (req: Request, res: Response) => {
        const { userId } = req.query;
        const { photoUrl} = req.body;
        // Validate the input
        if (!userId || !photoUrl) {
            return res.status(400).json({ error: "Both user ID and photo URL are required." });
        }

        try {
            // Update the photo URL for the specified user ID
            const updated = await User.findByIdAndUpdate(
                userId,
                { photo: photoUrl },
                { new: true }  // Returns the updated document
            );

            // Check if the document was found and updated
            if (!updated || !ProfessorController.isValidRole(updated.rol)) {
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

    /**
     * Change the active status of a professor
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static changeActiveStatusProfessor = async (req: Request, res: Response) => {
        const { professorId } = req.body;

        // Validate required fields
        if (!professorId) {
            return res.status(400).json({ error: "Profesor ID es requerido" });
        }

        try {
            // Find the professor using ID and campus
            const professorToBeActivated = await GuideProfessor.findOne({
                _id: professorId,
            });

            if (!professorToBeActivated) {
                return res.status(404).json({ error: "Profesor no encontrado." });
            } else {
                // Toggle the isActive status
                const updatedProfessor = await GuideProfessor.findByIdAndUpdate(
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

    /**
     * Set a professor as coordinator
     * @param req - Express Request object
     * @param res - Express Response object
     */
    public static setCoordinator = async (req: Request, res: Response): Promise<void> => {
        const { campus, newCoordinatorId } = req.body;

        try {
            // Find the current coordinator
            const currentCoordinator = await GuideProfessor.findOne({
                rol: Role.COORDINADOR,
                campus: campus
            });
            // Set all professors in the campus to not be coordinators
            await GuideProfessor.updateMany(
                { campus: campus },
                { $set: { isCoordinator: false, rol: Role.PROFESOR_GUIA } }
            );
            // Set the new coordinator
            const newCoordinator = await GuideProfessor.findOneAndUpdate(
                {_id: newCoordinatorId,
                    campus: campus
                },
                { $set: { isCoordinator: true, rol: Role.COORDINADOR } },
                { new: true }
            );
            // If the new coordinator could not be set
            if (!newCoordinator) {
                if (currentCoordinator) {
                    // Restore the previous coordinator if setting the new one failed
                    await GuideProfessor.findByIdAndUpdate(
                        currentCoordinator._id,
                        { $set: { isCoordinator: true, rol: Role.COORDINADOR } }
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
}
