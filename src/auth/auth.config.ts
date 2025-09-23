import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

// Función para crear la instancia de auth con los servicios
export const createAuth = (mailService: MailService, prismaService: PrismaService) => {
  return betterAuth({
    basePath: '/auth',
    database: prismaAdapter(prismaService, { provider: 'postgresql' }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async (data) => mailService.sendResetPasswordEmail(data.user.email, data.url),
    },
  });
};

// Instancia de auth exportada para uso en otros módulos
export const auth = createAuth(new MailService(), new PrismaService());
