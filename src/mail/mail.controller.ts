import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendEmail(@Body() body: { to: string; subject: string; text: string }) {
    const { to, subject, text } = body;
    await this.mailService.sendMail(to, subject, text);
    return { message: 'Correo enviado' };
  }

  @Post('reset-password')
  async sendResetPassword(@Body() body: { email: string; resetLink: string }) {
    const { email, resetLink } = body;
    await this.mailService.sendResetPasswordEmail(email, resetLink);
    return { message: 'Correo enviado' };
  }

  @Post('welcome')
  async sendWelcome(@Body() body: { email: string; name: string }) {
    const { email, name } = body;
    await this.mailService.sendWelcomeEmail(email, name);
    return { message: 'Correo enviado' };
  }
}
