import { Router } from "express";
import { AuthController } from '../../controllers/auth.controller';
import { validateToken } from "../../libs/verifyToken";



export class AuthRoutes {
    static get routes(): Router {
        const router = Router();

        const authController = new AuthController();

        router.post('/signup', authController.signUp); //* crear, registrar
        router.post('/signin', authController.signIn); //* iniciar sesion 
        router.get('/profile', validateToken, authController.profile);


        return router;
    }
}