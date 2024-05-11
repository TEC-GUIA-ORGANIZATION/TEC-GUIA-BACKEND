import { Router } from "express";
import { AuthController } from '../../controllers/auth.controller';
import { validateToken } from "../../libs/verifyToken";
import cors from "cors";



export class AuthRoutes {
    static get routes(): Router {
        const allowedOrigins = ['http://localhost:4200', 'https://frontend-tec-guia.azurewebsites.net'];
        const corsOptions = {
            origin: allowedOrigins,
            optionsSuccessStatus: 200,
            'access-control-expose-headers' : ['auth-token']//aquí pueden seguir agregando custom headers
          };
        const router = Router();

        const authController = new AuthController();

        router.post('/signup', authController.signUp); //* crear, registrar
        router.post('/signin',cors(corsOptions), authController.signIn); //* iniciar sesion 
        router.get('/profile', validateToken, authController.profile);


        return router;
    }
}