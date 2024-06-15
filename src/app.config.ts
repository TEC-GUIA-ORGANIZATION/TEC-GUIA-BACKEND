// app.config.ts

import env from './app.environment';

// Application Configuration
export const APP = {
    port: env.PORT,
    public_path: env.PUBLIC_PATH,
};

// MongoDB Configuration
export const MONGO_DB = {
    uri: env.MONGO_URI,
};

// Cross Domain Configuration
export const CROSS_DOMAIN = {
    allowedOrigins: [
        'http://localhost:4200',
    ],
};

// Authentication Configuration
export const AUTH = {
    jwtSecret: env.JWT_SECRET,
};
