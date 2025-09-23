import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, merchantId: string) {
    try {
      const category = await this.prisma.category.create({
        data: {
          ...createCategoryDto,
          merchantId,
        },
      });
      return category;
    } catch (error) {
      if (error.code === 'P2002') throw new ConflictException('El nombre de la categoría ya está en uso');
      throw error;
    }
  }

  async findAll(merchantId: string) {
    return this.prisma.category.findMany({
      where: { merchantId },
      include: {
        merchant: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findAllPublic() {
    return this.prisma.category.findMany({
      include: {
        merchant: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findOne(id: string, merchantId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) throw new NotFoundException('Categoría no encontrada');
    if (category.merchantId !== merchantId) throw new NotFoundException('No tienes permisos para ver esta categoría');

    return category;
  }

  async findByName(name: string) {
    const category = await this.prisma.category.findFirst({
      where: { name },
    });
    if (!category) throw new NotFoundException('Categoría no encontrada');

    return category;
  }

  async search(searchCategoryDto: SearchCategoryDto, merchantId: string) {
    const whereClause: any = {
      merchantId, // Solo buscar en las categorías del merchant
    };

    const categories = await this.prisma.category.findMany({
      where: whereClause,
      include: {
        merchant: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return categories;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, merchantId: string) {
    try {
      // Verificar que la categoría pertenece al merchant
      const existingCategory = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) throw new NotFoundException('Categoría no encontrada');
      if (existingCategory.merchantId !== merchantId) throw new NotFoundException('No tienes permisos para actualizar esta categoría');

      const category = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
        include: {
          merchant: true,
        },
      });
      return category;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Categoría no encontrada');
      if (error.code === 'P2002') throw new ConflictException('El nombre de la categoría ya está en uso');
      if (error instanceof NotFoundException) throw error;
      throw error;
    }
  }

  async remove(id: string, merchantId: string) {
    try {
      // Verificar que la categoría pertenece al merchant y contar productos
      const existingCategory = await this.prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { products: true } } },
      });

      if (!existingCategory) throw new NotFoundException('Categoría no encontrada');
      if (existingCategory.merchantId !== merchantId) throw new NotFoundException('No tienes permisos para eliminar esta categoría');
      if (existingCategory._count.products > 0) throw new ConflictException('No se puede eliminar la categoría porque tiene productos asociados');

      await this.prisma.category.delete({
        where: { id },
      });
      return { message: 'Categoría eliminada correctamente' };
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Categoría no encontrada');
      if (error instanceof NotFoundException || error instanceof ConflictException) throw error;
      throw error;
    }
  }
}
