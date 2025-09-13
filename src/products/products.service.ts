import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // Verificar que la categoría existe
      const category = await this.prisma.category.findUnique({
        where: { id: createProductDto.categoryId },
      });

      if (!category) {
        throw new BadRequestException('La categoría especificada no existe');
      }

      const product = await this.prisma.product.create({
        data: {
          ...createProductDto,
          id: crypto.randomUUID(),
        },
        include: {
          category: true,
        },
      });
      return product;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async search(query: string) {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { id: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
      },
    });

    return products;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      // Si se está actualizando la categoría, verificar que existe
      if (updateProductDto.categoryId) {
        const category = await this.prisma.category.findUnique({
          where: { id: updateProductDto.categoryId },
        });

        if (!category) {
          throw new BadRequestException('La categoría especificada no existe');
        }
      }

      const product = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          category: true,
        },
      });
      return product;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Producto no encontrado');
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return { message: 'Producto eliminado correctamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Producto no encontrado');
      }
      throw error;
    }
  }
}
