// error.ts

import { Response } from "express";

/**
 * Handle errors and send consistent responses
 * @param res - Express Response object
 * @param error - The error object
 * @param message - Custom error message
 */
export const HandleError = (res: Response, error: any, message: string) => {
    console.error(message, error);
    res.status(500).json({ error: message });
}

