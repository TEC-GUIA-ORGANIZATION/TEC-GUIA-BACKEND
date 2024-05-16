import { Request, Response } from "express";
import mongoose from 'mongoose';
import { ProfesorGuiaModel } from '../presentation/Models/profesorGuia.model';


export class GuideProfesorsController {


public changeActiveStatusProfessor = async (req: Request, res: Response) => {
    const { rol, name, firstLastname, secondLastname, email, officePhone, personalPhone, code } = req.body;
    // Validate required fields
    if (!rol || !name || !firstLastname || !secondLastname || !email || !officePhone || !personalPhone || !code) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    try {
        // Find the professor
        const professorToBeActivated = await ProfesorGuiaModel.findOne({
            email,
            name,
            firstLastname,
            secondLastname,
            officePhone,
            personalPhone,
            rol,
            code,
        });

        if (!professorToBeActivated) {
            res.status(404).json({ error: "Professor not found." });
        } else {
            // Toggle the isActive status
            const updatedProfessor = await ProfesorGuiaModel.findByIdAndUpdate(
                professorToBeActivated._id,
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

  
      
        


    

}