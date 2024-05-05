import 'dotenv/config';
import * as env from 'env-var';

export const envs = {

    PORT: env.get('PORT').required().asPortNumber(),
    PUBLIC_PATH: env.get('PUBLIC_PATH').default('public').asString(),
    TOKEN_SECRET: env.get('TOKEN_SECRET').required().asString(),
    //Mongo DB
    MONGO_URL: env.get('MONGO_URL').required().asString,
    MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString,
    MONGO_USER: env.get('MONGO_USER').required().asString,
    MONGO_PASS: env.get('MONGO_PASS').required().asString,
    MONGO_URI: env.get('MONGO_URI').required().asString,
}