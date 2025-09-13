import { betterAuth, uuidv4 } from 'better-auth';

import { PrismaClient } from '@prisma/client';
import { openAPI } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';

const prisma = new PrismaClient();

export const auth = betterAuth({
  advanced: {
    database: {
      // generateId: false,
      // generateId: () => uuidv4().toString(),
    },
    crossSubDomainCookies: {
      enabled: true,
      // domain: process.env.COOKIE_DOMAIN || undefined,
    },
    cookie: {
      sameSite: 'none',
      secure: true,
      // domain: process.env.COOKIE_DOMAIN || undefined,
      path: '/',
    },
    defaultCookieAttributes: {
      secure: true,
      // httpOnly: true,
      sameSite: 'none', // Allows CORS-based cookie sharing across subdomains
      // partitioned: true, // New browser standards will mandate this for foreign cookies
    },
  },
  trustedOrigins: ['*'],
  basePath: '/auth',
  database: prismaAdapter(prisma, { provider: 'postgresql', debugLogs: true }),
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  plugins: [openAPI({ path: '/docs' })],
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 * 1 },
  user: {
    additionalFields: {
      businessLogo: { type: 'string', required: false },
      cedulaPhoto: { type: 'string', required: false },
      storeFrontPhoto: { type: 'string', required: false },
      businessName: { type: 'string', required: false },
      businessAddress: { type: 'string', required: false },
      nationalId: { type: 'string', required: false },
      city: { type: 'string', required: false },
      phone: { type: 'string', required: false },
    },
  },
});
