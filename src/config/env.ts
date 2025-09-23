import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const env = {
  // Variables obligatorias
  DATABASE_URL: process.env.DATABASE_URL!,
  EMAIL_USER: process.env.EMAIL_USER!,
  EMAIL_PASS: process.env.EMAIL_PASS!,

  // Variables con valores por defecto
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587'),
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
  PORT: parseInt(process.env.PORT || '3000'),
  NODE_ENV: process.env.NODE_ENV || 'development',
};
