// import { configDotenv } from 'dotenv';

// configDotenv({ path: './.env.local' });
// configDotenv({ path: './.env.dev' });

require('dotenv').config();

export const SECRET = process.env.JWT_SECRET;
export const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const ALGORITHM = process.env.ALGORITHM;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
export const BOT_ACCESS_TOKEN_EXPIRY = process.env.BOT_ACCESS_TOKEN_EXPIRY;
export const BOT_REFRESH_TOKEN_EXPIRY = process.env.BOT_REFRESH_TOKEN_EXPIRY;
