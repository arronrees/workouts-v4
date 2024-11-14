export const __in_production = process.env.NODE_ENV === 'production';

export const DB_HOST = process.env.DB_HOST as string;
export const DB_PORT = Number(process.env.DB_PORT);
export const DB_USER = process.env.DB_USER as string;
export const DB_PASS = process.env.DB_PASS as string;
export const DB_NAME = process.env.DB_NAME as string;
export const DB_URL = process.env.DATABASE_URL as string;

export const WEB_URL = process.env.WEB_URL as string;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
