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
    // db_name: env.MONGO_DB_NAME,
    // user: env.MONGO_USER,
    // password: env.MONGO_PASS,
};

// Cross Domain Configuration
export const CROSS_DOMAIN = {
    allowedOrigins: [
        '*', // Allow all origins
    ],
};

// Authentication Configuration
export const AUTH = {
    jwtSecret: env.JWT_SECRET,
};
