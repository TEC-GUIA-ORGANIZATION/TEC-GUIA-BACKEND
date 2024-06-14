// app.environment.ts

import 'dotenv/config';
import env from 'env-var';

// Define and validate environment variables
const config = {
  PORT: env.get('PORT').required().asPortNumber(),
  PUBLIC_PATH: env.get('PUBLIC_PATH').default('public').asString(),

  MONGO_URI: env.get('MONGO_URI').required().asString(),
  // MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString(),
  // MONGO_USER: env.get('MONGO_USER').required().asString(),
  // MONGO_PASS: env.get('MONGO_PASS').required().asString(),

  JWT_SECRET: env.get('TOKEN_SECRET').required().asString(),
};

// Export the configuration
export default config;
