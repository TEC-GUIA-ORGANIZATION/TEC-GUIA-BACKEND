import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { envs } from "../config/envs";

export class Auth {

    public constructor() {}

    public auth = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.cookies;

            if(!token)
                return res
                    .status(403)
                    .json({message: 'Authorization denied'});
            
            jwt.verify(token, envs.TOKEN_SECRET, (error: any, user: any) => {
                if (error) {
                    return res.status(401).json({ message: "Token is not valid" });
                }
                // req.user = user;
                next();
            });
        } catch (error) {
            
        }
    }
}
