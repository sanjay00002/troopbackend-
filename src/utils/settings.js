import { configDotenv } from 'dotenv';

// configDotenv({ path: './.env.local' });
configDotenv({ path: './.env.dev' });

export const SECRET = process.env.JWT_SECRET;
export const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const ALGORITHM = process.env.ALGORITHM;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
