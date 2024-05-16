import { Request, Response } from "express";
import mongoose from 'mongoose';
import { ProfesorGuiaModel } from '../presentation/Models/profesorGuia.model';
import  { IGuideProfessor} from '../presentation/Models/profesorGuia.model'
import { rol } from '../utils/rol.enum';
import { GuideProfesorsRoutes } from "../presentation/Routes/guideProfessor.router";

export class GuideProfesorsController {


    public changeActiveStatusProfessor = async (req: Request, res: Response) => {
        // const { rol, name, firstLastname, secondLastname, email, officePhone, personalPhone, code } = req.body;
        // // Validate required fields
        // if (!rol || !name || !firstLastname || !secondLastname || !email || !officePhone || !personalPhone || !code) {
        //     return res.status(400).json({ error: "Todos los campos son requeridos" });
        // }


        try {
            const{guideProfessorId} = req.query;
            // Find the professor
            const professorToBeActivated = await ProfesorGuiaModel.findById({
                _id:guideProfessorId
            });

            if (!professorToBeActivated) {
                res.status(404).json({ error: "Professor not found." });
            } else {
                // Toggle the isActive status
                const updatedProfessor = await ProfesorGuiaModel.findByIdAndUpdate(
                    guideProfessorId,
                    { isActive: !professorToBeActivated.isActive },
                    { new: true }
                );
                if (!updatedProfessor) {
                    res.status(500).json({ error: "Fallo la actualizacion del profesor" });
                }
                // Respond with the updated professor
                res.status(200).json({ message: "Estado de profesor actualizado correctamente", updatedProfessor });
            }
        } catch (error) {
            console.error("Error cambiando estatus ", error);
            res.status(500).json({ error: "An error occurred while changing the active status of the professor." });
        }
    }

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
            const newCoordinator = await ProfesorGuiaModel.findByIdAndUpdate(
                newCoordinatorId,
                { $set: { rol: rol.COORDINADOR } },
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
            } 
            await newCoordinator?.save();
            // Successfully updated the coordinator
            res.status(200).json({
                message: 'Coordinador asignado correctamente',
                newCoordinator
            });
        } catch (error) {
            console.error("Error setting coordinator:", error);
            res.status(500).json({ error: "Ocurrió un error al actualizar el coordinador" });
        }
    }


    // private async setCoordinator(req: Request, res: Response) {
    //     const { campus, newCoordinatorId } = req.body;

    //     try {
    //         const currentCoordinator = await this.findCurrentCoordinator(campus);
    //         await this.resetCoordinators(campus);
    //         const newCoordinator = await this.assignNewCoordinator(newCoordinatorId);
    //         if (!newCoordinator) {
    //             (!currentCoordinator)? this.sendErrorResponse(res, "No se encontró el nuevo coordinador.")
    //             :  await this.restorePreviousCoordinator(currentCoordinator)
    //             this.sendErrorResponse(res, "No se encontró el nuevo coordinador.");
    //         }

    //         res.status(200).json({
    //             message: 'Coordinador asignado correctamente',
    //             newCoordinator
    //         });
    //     } catch (error) {
    //         console.error("Error setting coordinator:", error);
    //         res.status(500).json({ error: "Ocurrió un error al actualizar el coordinador" });
    //     }
    // }

    // public async findCurrentCoordinator(campus: string):Promise<IGuideProfessor | null>  {
    //     return  ProfesorGuiaModel.findOne({ rol: rol.COORDINADOR, campus:campus }); 
    // }

    // private async resetCoordinators(campus: string) {
    //     return ProfesorGuiaModel.updateMany(
    //         { campus },
    //         { $set: { isCoordinator: false, rol: rol.PROFESOR_GUIA } }
    //     );
    // }

    // private async assignNewCoordinator(newCoordinatorId: string) {
    //     return ProfesorGuiaModel.findByIdAndUpdate(
    //         newCoordinatorId,
    //         { $set: { isCoordinator: true, rol: rol.COORDINADOR } },
    //         { new: true }
    //     );
    // }

    // private async restorePreviousCoordinator(currentCoordinator: IGuideProfessor) {
    //     if (currentCoordinator) {
    //         return ProfesorGuiaModel.findByIdAndUpdate(
    //             currentCoordinator._id,
    //             { $set: { isCoordinator: true, rol: rol.COORDINADOR } }
    //         );
    //     }
    // }

    // private sendErrorResponse(res: Response, message: string) {
    //     res.status(500).json({
    //         error: "Error al asignar nuevo coordinador",
    //         message
    //     });
    // }

}