import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { MerchantsService } from '../merchants/merchants.service';
import { PrismaService } from '../prisma/prisma.service';
import { SearchDto } from './dto/search.dto';
import { StorageService } from '../storage/storage.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { auth } from 'src/auth/auth.config';

// Variables de configuración del administrador
const ADMIN_EMAIL = 'admin@regateos.com';
const ADMIN_PASSWORD = 'regateosV$$';

// Variables de configuración del merchant
const MERCHANT_EMAIL = 'joel.edu.v@gmail.com';
const MERCHANT_PASSWORD = 'regateosV$$';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private merchantsService: MerchantsService,
  ) {}

  async onModuleInit() {
    // El usuario admin se crea desde main.ts para evitar duplicación
  }

  // 1. CREAR usuario usando Better Auth signUpEmail y crear merchant asociado
  async createUser(
    data: CreateUserDto,
    files: {
      businessLogo?: Express.Multer.File[];
      nationalIdImage?: Express.Multer.File[];
      storeFrontImage?: Express.Multer.File[];
    },
  ): Promise<User> {
    try {
      // Verificar que todos los archivos requeridos estén presentes
      const missingFiles: string[] = [];
      if (!files.businessLogo?.[0]) missingFiles.push('businessLogo');
      if (!files.nationalIdImage?.[0]) missingFiles.push('nationalIdImage');
      if (!files.storeFrontImage?.[0]) missingFiles.push('storeFrontImage');

      if (missingFiles.length > 0) {
        throw new BadRequestException(`Faltan archivos obligatorios: ${missingFiles.join(', ')}`);
      }

      // Crear usuario primero con Better Auth (solo datos básicos)
      const authResult = await auth.api.signUpEmail({
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
        },
      });

      const user = await this.prisma.user.findFirst({ where: { email: data.email } });
      if (!user) throw new BadRequestException('Usuario no encontrado');

      // Crear merchant asociado con los datos del negocio y archivos
      await this.merchantsService.createMerchant(
        {
          userId: user.id,
          verified: false,
          businessName: data.businessName,
          businessAddress: data.businessAddress,
          nationalId: data.nationalId,
          city: data.city,
          phone: data.phone,
        },
        files,
      );

      // Retornar usuario con merchant incluido
      return this.getUserById(user.id);
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
      include: {
        merchant: {
          include: {
            businessLogo: true,
            nationalIdImage: true,
            storeFrontImage: true,
          },
        },
      },
    });

    return users;
  }

  // 3. VER usuario por ID
  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        merchant: {
          include: {
            businessLogo: true,
            nationalIdImage: true,
            storeFrontImage: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user;
  }

  // 4. ACTUALIZAR datos del usuario (sin archivos)
  async updateUserData(id: string, data: UpdateUserDto): Promise<User> {
    try {
      // Buscar el usuario existente
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
        include: { merchant: true },
      });
      if (!existingUser) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verificar que no sea el usuario admin
      if (existingUser.email === ADMIN_EMAIL) {
        throw new BadRequestException('No se puede actualizar el usuario admin');
      }

      // Preparar datos de actualización del usuario
      const userUpdateData: any = {};
      if (data.name) userUpdateData.name = data.name;
      if (data.email) userUpdateData.email = data.email;

      // Actualizar datos del usuario
      await this.prisma.user.update({
        where: { id },
        data: userUpdateData,
      });

      // Si existe merchant, actualizar sus datos también
      if (existingUser.merchant) {
        const merchantUpdateData: any = {};
        if (data.businessName) merchantUpdateData.businessName = data.businessName;
        if (data.businessAddress) merchantUpdateData.businessAddress = data.businessAddress;
        if (data.nationalId) merchantUpdateData.nationalId = data.nationalId;
        if (data.city) merchantUpdateData.city = data.city;
        if (data.phone) merchantUpdateData.phone = data.phone;
        if (data.verified !== undefined) merchantUpdateData.verified = data.verified;

        if (Object.keys(merchantUpdateData).length > 0) {
          await this.prisma.merchant.update({
            where: { id: existingUser.merchant.id },
            data: merchantUpdateData,
          });
        }
      }

      // Retornar usuario actualizado
      return this.getUserById(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al actualizar datos del usuario: ${error.message}`);
    }
  }

  // 5. ACTUALIZAR archivos del usuario
  async updateUserFiles(
    id: string,
    files: {
      businessLogo?: Express.Multer.File[];
      nationalIdImage?: Express.Multer.File[];
      storeFrontImage?: Express.Multer.File[];
    },
  ): Promise<User> {
    try {
      // Buscar el usuario existente
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
        include: { merchant: true },
      });
      if (!existingUser) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verificar que no sea el usuario admin
      if (existingUser.email === ADMIN_EMAIL) {
        throw new BadRequestException('No se puede actualizar el usuario admin');
      }

      // Si existe merchant, actualizar sus archivos
      if (existingUser.merchant) {
        await this.merchantsService.updateMerchantFiles(existingUser.merchant.id, files);
      }

      // Retornar usuario actualizado
      return this.getUserById(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al actualizar archivos del usuario: ${error.message}`);
    }
  }

  // 6. CREAR usuarios por defecto (admin y merchant) si no existen
  async createDefaultUsers(): Promise<void> {
    try {
      // Crear usuario admin
      await this.createDefaultAdmin();

      // Crear usuario merchant
      await this.createDefaultMerchant();
    } catch (error) {
      console.error('❌ Error al crear usuarios por defecto:', error.message);
    }
  }

  // Crear usuario admin por defecto si no existe
  async createDefaultAdmin(): Promise<void> {
    try {
      // Verificar si el usuario admin ya existe
      const existingAdmin = await this.prisma.user.findUnique({
        where: { email: ADMIN_EMAIL },
      });

      if (existingAdmin) {
        console.log('✅ Usuario admin ya existe');
        return;
      }

      // Crear el usuario admin
      await auth.api.signUpEmail({
        body: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          name: 'Administrador',
        },
      });

      console.log('✅ Usuario admin creado exitosamente');
    } catch (error) {
      console.error('❌ Error al crear usuario admin:', error.message);
    }
  }

  // Crear usuario merchant por defecto si no existe
  async createDefaultMerchant(): Promise<void> {
    try {
      // Verificar si el usuario merchant ya existe
      const existingMerchant = await this.prisma.user.findUnique({
        where: { email: MERCHANT_EMAIL },
      });

      if (existingMerchant) {
        console.log('✅ Usuario merchant ya existe');
        return;
      }

      // Crear el usuario merchant
      const signUpResult = await auth.api.signUpEmail({
        body: {
          email: MERCHANT_EMAIL,
          password: MERCHANT_PASSWORD,
          name: 'Merchant Regateos',
        },
      });

      if (!signUpResult.user) {
        throw new Error('No se pudo crear el usuario merchant');
      }

      const user = signUpResult.user;

      // Crear merchant asociado al usuario
      await this.merchantsService.createMerchant({
        userId: user.id,
        businessName: 'Regateos - Tienda Principal',
        businessAddress: 'Av. 9 de Octubre 123, Guayaquil',
        nationalId: '1234567890',
        city: 'Guayaquil',
        phone: '+593987654321',
        verified: true,
      });

      console.log('✅ Usuario merchant creado exitosamente');
    } catch (error) {
      console.error('❌ Error al crear usuario merchant:', error.message);
    }
  }

  // 7. ELIMINAR usuario
  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      // Buscar el usuario para verificar que existe
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { merchant: true },
      });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verificar que no sea el usuario admin
      if (user.email === ADMIN_EMAIL) {
        throw new BadRequestException('No se puede eliminar el usuario admin');
      }

      // Si existe merchant, eliminarlo primero (esto eliminará automáticamente los archivos)
      if (user.merchant) {
        await this.merchantsService.deleteMerchant(user.merchant.id);
      }

      // Eliminar el usuario de la base de datos
      await this.prisma.user.delete({ where: { id } });

      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al eliminar usuario: ${error.message}`);
    }
  }

  // ===== MÉTODOS PARA ARCHIVOS PRIVADOS DE USUARIOS =====
  // Todos los métodos específicos eliminados - usar solo funciones CRUD del StorageService
}
