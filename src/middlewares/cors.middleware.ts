// cors.middleware.ts

import cors from 'cors';
import * as APP_CONFIG from '../app.config';

const allowedOrigins = [...APP_CONFIG.CROSS_DOMAIN.allowedOrigins];

const allowedMethods = [
    'GET',
    'POST',
    'PATCH',
    'PUT',
    'DELETE',
    'OPTIONS',
];

const allowedHeaders = [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Auth-Token',
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Origin not allowed by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: allowedMethods,
    allowedHeaders: allowedHeaders,
};

export default cors(corsOptions);
