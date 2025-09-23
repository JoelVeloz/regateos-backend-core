import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateMerchantDto } from './dto/create-merchant.dto';
import { Merchant } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SearchMerchantDto } from './dto/search-merchant.dto';
import { StorageService } from '../storage/storage.service';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  // 1. CREAR merchant
  async createMerchant(
    data: CreateMerchantDto,
    files?: {
      businessLogo?: Express.Multer.File[];
      nationalIdImage?: Express.Multer.File[];
      storeFrontImage?: Express.Multer.File[];
    },
  ): Promise<Merchant> {
    try {
      // Verificar que el usuario existe
      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
      });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verificar que el usuario no tenga ya un merchant
      const existingMerchant = await this.prisma.merchant.findUnique({
        where: { userId: data.userId },
      });
      if (existingMerchant) {
        throw new BadRequestException('El usuario ya tiene un merchant asociado');
      }

      // Usar transacción para crear merchant y archivos
      return await this.prisma.$transaction(async (tx) => {
        const merchantData: any = {
          userId: data.userId,
          verified: data.verified || false,
          businessName: data.businessName,
          businessAddress: data.businessAddress,
          nationalId: data.nationalId,
          city: data.city,
          phone: data.phone,
        };

        // Manejar archivos si están presentes
        if (files?.businessLogo?.[0]) {
          const businessLogoFile = await this.storageService.create({ provider: 'local', folder: 'merchants' }, files.businessLogo[0]);
          merchantData.businessLogoId = businessLogoFile.id;
        }

        if (files?.nationalIdImage?.[0]) {
          const nationalIdImageFile = await this.storageService.create({ provider: 'local', folder: 'merchants' }, files.nationalIdImage[0]);
          merchantData.nationalIdImageId = nationalIdImageFile.id;
        }

        if (files?.storeFrontImage?.[0]) {
          const storeFrontImageFile = await this.storageService.create({ provider: 'local', folder: 'merchants' }, files.storeFrontImage[0]);
          merchantData.storeFrontImageId = storeFrontImageFile.id;
        }

        return tx.merchant.create({
          data: merchantData,
          include: {
            user: true,
            businessLogo: true,
            nationalIdImage: true,
            storeFrontImage: true,
          },
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al crear merchant: ${error.message}`);
    }
  }

  // 2. VER todos los merchants
  async getAllMerchants(data: SearchMerchantDto): Promise<Merchant[]> {
    const where: any = {};

    if (data.businessName) {
      where.businessName = {
        contains: data.businessName,
        mode: 'insensitive',
      };
    }

    if (data.city) {
      where.city = {
        contains: data.city,
        mode: 'insensitive',
      };
    }

    if (data.nationalId) {
      where.nationalId = {
        contains: data.nationalId,
        mode: 'insensitive',
      };
    }

    if (data.phone) {
      where.phone = {
        contains: data.phone,
        mode: 'insensitive',
      };
    }

    return this.prisma.merchant.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        businessLogo: true,
        nationalIdImage: true,
        storeFrontImage: true,
      },
    });
  }

  // 3. VER merchant por ID
  async getMerchantById(id: string): Promise<Merchant> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: {
        user: true,
        businessLogo: true,
        nationalIdImage: true,
        storeFrontImage: true,
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant no encontrado');
    }

    return merchant;
  }

  // 4. VER merchant por userId
  async getMerchantByUserId(userId: string): Promise<Merchant> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { userId },
      include: {
        user: true,
        businessLogo: true,
        nationalIdImage: true,
        storeFrontImage: true,
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant no encontrado para este usuario');
    }

    return merchant;
  }

  // 5. ACTUALIZAR datos del merchant (sin archivos)
  async updateMerchantData(id: string, data: UpdateMerchantDto): Promise<Merchant> {
    try {
      const existingMerchant = await this.prisma.merchant.findUnique({
        where: { id },
      });
      if (!existingMerchant) {
        throw new NotFoundException('Merchant no encontrado');
      }

      const updateData: any = {};
      if (data.verified !== undefined) updateData.verified = data.verified;
      if (data.businessName) updateData.businessName = data.businessName;
      if (data.businessAddress) updateData.businessAddress = data.businessAddress;
      if (data.nationalId) updateData.nationalId = data.nationalId;
      if (data.city) updateData.city = data.city;
      if (data.phone) updateData.phone = data.phone;

      return await this.prisma.merchant.update({
        where: { id },
        data: updateData,
        include: {
          user: true,
          businessLogo: true,
          nationalIdImage: true,
          storeFrontImage: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al actualizar datos del merchant: ${error.message}`);
    }
  }

  // 6. ACTUALIZAR archivos del merchant
  async updateMerchantFiles(
    id: string,
    files: {
      businessLogo?: Express.Multer.File[];
      nationalIdImage?: Express.Multer.File[];
      storeFrontImage?: Express.Multer.File[];
    },
  ): Promise<Merchant> {
    try {
      const existingMerchant = await this.prisma.merchant.findUnique({
        where: { id },
        include: {
          businessLogo: true,
          nationalIdImage: true,
          storeFrontImage: true,
        },
      });
      if (!existingMerchant) {
        throw new NotFoundException('Merchant no encontrado');
      }

      return await this.prisma.$transaction(async (tx) => {
        const updateData: any = {};

        // Manejar archivos si están presentes
        if (files.businessLogo?.[0]) {
          // Eliminar archivo anterior si existe
          if (existingMerchant.businessLogoId) {
            await this.storageService.remove(existingMerchant.businessLogoId);
          }
          // Crear nuevo archivo y conectar
          const fileRecord = await this.storageService.create({ provider: 'local', folder: 'merchants' }, files.businessLogo[0]);
          updateData.businessLogoId = fileRecord.id;
        }

        if (files.nationalIdImage?.[0]) {
          // Eliminar archivo anterior si existe
          if (existingMerchant.nationalIdImageId) {
            await this.storageService.remove(existingMerchant.nationalIdImageId);
          }
          // Crear nuevo archivo y conectar
          const fileRecord = await this.storageService.create({ provider: 'local', folder: 'merchants' }, files.nationalIdImage[0]);
          updateData.nationalIdImageId = fileRecord.id;
        }

        if (files.storeFrontImage?.[0]) {
          // Eliminar archivo anterior si existe
          if (existingMerchant.storeFrontImageId) {
            await this.storageService.remove(existingMerchant.storeFrontImageId);
          }
          // Crear nuevo archivo y conectar
          const fileRecord = await this.storageService.create({ provider: 'local', folder: 'merchants' }, files.storeFrontImage[0]);
          updateData.storeFrontImageId = fileRecord.id;
        }

        return tx.merchant.update({
          where: { id },
          data: updateData,
          include: {
            user: true,
            businessLogo: true,
            nationalIdImage: true,
            storeFrontImage: true,
          },
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al actualizar archivos del merchant: ${error.message}`);
    }
  }

  // 7. ELIMINAR merchant
  async deleteMerchant(id: string): Promise<{ message: string }> {
    try {
      const merchant = await this.prisma.merchant.findUnique({
        where: { id },
        include: {
          businessLogo: true,
          nationalIdImage: true,
          storeFrontImage: true,
        },
      });
      if (!merchant) {
        throw new NotFoundException('Merchant no encontrado');
      }

      // Eliminar archivos asociados al merchant usando StorageService
      if (merchant.businessLogoId) await this.storageService.remove(merchant.businessLogoId);
      if (merchant.nationalIdImageId) await this.storageService.remove(merchant.nationalIdImageId);
      if (merchant.storeFrontImageId) await this.storageService.remove(merchant.storeFrontImageId);

      // Eliminar el merchant de la base de datos
      await this.prisma.merchant.delete({ where: { id } });

      return { message: 'Merchant eliminado correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al eliminar merchant: ${error.message}`);
    }
  }
}
