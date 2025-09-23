import * as nodemailer from 'nodemailer';

import { BadGatewayException, Injectable } from '@nestjs/common';

import { env } from '../config/env';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: true,
      auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const from = `Regateos <support@recargaloya.com>`;

    const mailOptions = { from, to, subject, text };

    const info = await this.transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
  }

  async sendResetPasswordEmail(email: string, resetLink: string): Promise<void> {
    try {
      const subject = 'Restablecer contraseña';
      const text = `Para restablecer tu contraseña, visita: ${resetLink}`;

      await this.sendMail(email, subject, text);
      console.log('Correo de restablecimiento enviado a:', email);
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento:', error);

      throw new BadGatewayException('Error al enviar correo de restablecimiento');
      // No relanzamos el error para que better-auth no falle
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const subject = 'Bienvenido a Regateos';
      const text = `Hola ${name}, bienvenido a Regateos!`;

      await this.sendMail(email, subject, text);
      console.log('Correo de bienvenida enviado a:', email);
    } catch (error) {
      console.error('Error al enviar correo de bienvenida:', error);
      // No relanzamos el error
    }
  }
}
