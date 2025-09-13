import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { Module } from '@nestjs/common';
import { auth } from './auth.config';

@Module({
  imports: [BetterAuthModule.forRoot(auth)],
})
export class AuthModule {}
