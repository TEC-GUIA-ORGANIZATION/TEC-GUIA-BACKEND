import { Router } from "express";
import { ActivitiesController } from "../../controllers/activities.controller";

export class ActivitiesRoute {

    static get routes(): Router {
        const router = Router();
        const activitiesController = new ActivitiesController();

        router.post('/', activitiesController.createActivity); //* Crear
        router.post('/:id/poster', activitiesController.uploadPoster); //* Subir poster
        router.get('/nexActivity', activitiesController.getNextActivity); //*Obtener la siguiente actividad
        router.get('/', activitiesController.getActivities); //* Obtener por id
        router.get('/:id', activitiesController.getActivitiesById); //*Obtener todo
        router.delete('/:id', activitiesController.deleteActivity); //* Eliminar
        router.patch('/:id', activitiesController.updateActivity) //* Actualizar 
        router.patch('/cancel/:id', activitiesController.cancelActivity); //* Cancelar actividad
        router.patch('/markAsCompleted/:id', activitiesController.markActivityAsCompleted) //* Marcar como completada 

        return router;
    }
}
