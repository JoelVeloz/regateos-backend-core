import { AuthGuard, AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import { APP_GUARD } from '@nestjs/core';
import { MailModule } from '../mail/mail.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { auth } from './auth.config';

@Module({
  imports: [MailModule, PrismaModule, BetterAuthModule.forRoot(auth)],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AuthModule {}
