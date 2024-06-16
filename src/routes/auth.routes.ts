// auth.routes.ts

import { Router } from "express";
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/signin', AuthController.signIn); // Login
router.post('/signup', AuthController.signUp); // Register
router.get('/profile', AuthController.validateToken); // Validation

export default router;
