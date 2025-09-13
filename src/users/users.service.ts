import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SearchDto } from './dto/search.dto';
import { User } from '@prisma/client';
import { auth } from 'src/auth/auth.config';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. CREAR usuario usando Better Auth signUpEmail
  async createUser(data: CreateUserDto): Promise<User> {
    try {
      const d = await auth.api.signUpEmail({
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
        },
      });
      return d.user as User;
    } catch (error) {
      throw new BadRequestException(`Error al crear usuario: ${error.message}`);
    }
  }

  // 2. VER todos los usuarios
  async getAllUsers(data: SearchDto): Promise<User[]> {
    const where = data.email
      ? {
          email: {
            contains: data.email,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }

  // 3. VER usuario por ID
  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user;
  }

  // 4. CREAR usuario admin por defecto si no existe
  async createDefaultAdmin(): Promise<void> {
    try {
      const adminEmail = 'admin@admin.com';

      // Verificar si el usuario admin ya existe
      const existingAdmin = await this.prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (existingAdmin) {
        console.log('✅ Usuario admin ya existe');
        return;
      }

      // Crear el usuario admin
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: 'Joel2025$$123',
          name: 'Administrador',
        },
      });

      console.log('✅ Usuario admin creado exitosamente');
    } catch (error) {
      console.error('❌ Error al crear usuario admin:', error.message);
    }
  }
}
