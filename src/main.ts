import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { UsersService } from './users/users.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Requerido para Better Auth
  });

  // Habilitar CORS para desarrollo
  app.enableCors({ origin: true, credentials: true });

  // Enable validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Crear usuarios por defecto (admin y merchant) si no existen
  const usersService = app.get(UsersService);
  await usersService.createDefaultUsers();

  const port = process.env.PORT ?? 4000;

  await app.listen(port);
  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
}
bootstrap();
