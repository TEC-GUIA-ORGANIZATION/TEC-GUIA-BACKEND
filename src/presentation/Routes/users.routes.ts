import { Router } from "express";

import { UserController } from "../../controllers/user.controller";

export class UsersRoutes {

    static get routes(): Router {

        const router = Router();

        const usersController = new UserController();

        router.get('/', usersController.getUsers);
        router.get('/:id', usersController.getUserById);

        return router;
    }
}
