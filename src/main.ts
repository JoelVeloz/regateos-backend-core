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
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Crear usuario admin por defecto si no existe
  const usersService = app.get(UsersService);
  await usersService.createDefaultAdmin();

  const port = process.env.PORT ?? 4000;

  await app.listen(port);
  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
}
bootstrap();
