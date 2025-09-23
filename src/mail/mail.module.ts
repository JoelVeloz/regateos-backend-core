import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
