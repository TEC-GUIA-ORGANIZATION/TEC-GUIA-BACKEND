import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config(); // Cargar las variables de entorno de .env


export function createAccessToken(payload: String | Object | Buffer): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const options: jwt.SignOptions = { expiresIn: "1d" };
        jwt.sign(payload, process.env.TOKEN_SECRET as string, options, (err, token) => {
            if (err) reject(err);
            resolve(token as string);
        });
    });
}

