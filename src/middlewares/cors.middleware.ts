// cors.middleware.ts

import cors from 'cors';
import * as APP_CONFIG from '../app.config';

const allowedOrigins = [...APP_CONFIG.CROSS_DOMAIN.allowedOrigins];

const allowedMethods = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'OPTIONS',
];

const allowedHeaders = [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
];

export const corsMiddleware = cors({
    origin: allowedOrigins,
    methods: allowedMethods,
    allowedHeaders: allowedHeaders,
});
