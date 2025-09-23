import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProductStatus } from './enums';
import { PublicProductsFilterDto } from './dto/public-products-filter.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { StorageService } from '../storage/storage.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(createProductDto: CreateProductDto, merchantId: string, images?: Express.Multer.File[]) {
    try {
      // Verificar que la categoría existe
      const category = await this.prisma.category.findUnique({
        where: { id: createProductDto.categoryId },
      });

      if (!category) {
        throw new BadRequestException('La categoría especificada no existe');
      }

      // Usar transacción para operaciones atómicas
      return await this.prisma.$transaction(async (tx) => {
        // Crear el producto primero
        const product = await tx.product.create({
          data: {
            name: createProductDto.name,
            categoryId: createProductDto.categoryId,
            price: createProductDto.price,
            description: createProductDto.description,
            discountPercent: createProductDto.discountPercent,
            discountFixed: createProductDto.discountFixed,
            status: createProductDto.status || ProductStatus.DRAFT,
            merchantId,
          },
        });

        // Si hay imágenes, crearlas usando StorageService y conectarlas al producto
        if (images && images.length > 0) {
          const filePromises = images.map(async (image) => {
            // Crear archivo usando StorageService
            const fileRecord = await this.storageService.create({ provider: 'local', folder: 'products' }, image);
            // Conectar el archivo al producto usando Prisma connect
            return tx.product.update({ where: { id: product.id }, data: { images: { connect: { id: fileRecord.id } } } });
          });

          await Promise.all(filePromises);
        }

        // Retornar el producto con todas las relaciones
        return tx.product.findUnique({
          where: { id: product.id },
          include: { category: true, images: true, merchant: true },
        });
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw error;
    }
  }

  async findAll(merchantId: string) {
    return this.prisma.product.findMany({
      where: { merchantId },
      include: { category: true, images: true },
    });
  }

  async findAllPublic(filter: PublicProductsFilterDto) {
    const { user_id } = filter;

    // Construir condiciones de filtro
    const whereConditions: any = {};

    // Filtro por merchant
    if (user_id) {
      // Buscar el merchant del usuario
      const merchant = await this.prisma.merchant.findUnique({
        where: { userId: user_id },
      });
      if (merchant) {
        whereConditions.merchantId = merchant.id;
      }
    }

    // Ejecutar consulta
    const products = await this.prisma.product.findMany({
      where: whereConditions,
      include: {
        category: true,
        merchant: true,
        images: true,
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return products;
  }
  async findOnePublic(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true, merchant: true, images: true },
    });
  }

  async findOne(id: string, merchantId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true },
    });

    if (!product) throw new NotFoundException('Producto no encontrado');

    if (product.merchantId !== merchantId) throw new NotFoundException('No tienes permisos para ver este producto');

    return product;
  }

  async search(searchProductDto: SearchProductDto, merchantId: string) {
    const whereClause: any = {
      merchantId, // Solo buscar en los productos del merchant
    };

    const products = await this.prisma.product.findMany({
      where: whereClause,
      include: { category: true, merchant: true, images: true },
    });

    return products;
  }

  async update(id: string, updateProductDto: UpdateProductDto, merchantId: string) {
    try {
      // Verificar que el producto pertenece al usuario
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) throw new NotFoundException('Producto no encontrado');
      if (existingProduct.merchantId !== merchantId) throw new NotFoundException('No tienes permisos para actualizar este producto');

      // Si se está actualizando la categoría, verificar que existe
      if (updateProductDto.categoryId) {
        const category = await this.prisma.category.findUnique({ where: { id: updateProductDto.categoryId } });
        if (!category) throw new BadRequestException('La categoría especificada no existe');
      }

      // Actualizar solo los datos del producto
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          category: true,
          images: true,
          merchant: true,
        },
      });

      return updatedProduct;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Producto no encontrado');
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Error al actualizar el producto');
    }
  }

  async remove(id: string, merchantId: string) {
    try {
      // Verificar que el producto pertenece al usuario
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) throw new NotFoundException('Producto no encontrado');

      if (existingProduct.merchantId !== merchantId) throw new NotFoundException('No tienes permisos para eliminar este producto');

      await this.prisma.product.delete({ where: { id } });
      return { message: 'Producto eliminado correctamente' };
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException('Producto no encontrado');
      if (error instanceof NotFoundException) throw error;
      throw error;
    }
  }

  // ===== MÉTODOS PARA MANEJO DE IMÁGENES DE PRODUCTOS =====

  async addImagesToProduct(productId: string, merchantId: string, images: Express.Multer.File[]) {
    try {
      // Verificar que el producto pertenece al usuario
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) throw new NotFoundException('Producto no encontrado');
      if (product.merchantId !== merchantId) throw new NotFoundException('No tienes permisos para modificar este producto');

      // Usar transacción para operaciones atómicas
      return await this.prisma.$transaction(async (tx) => {
        const filePromises = images.map(async (image) => {
          // Crear archivo usando StorageService
          const fileRecord = await this.storageService.create({ provider: 'local', folder: 'products' }, image);

          // Conectar el archivo al producto
          return tx.product.update({
            where: { id: productId },
            data: {
              images: {
                connect: { id: fileRecord.id },
              },
            },
          });
        });

        await Promise.all(filePromises);

        // Retornar el producto actualizado con todas las imágenes
        return tx.product.findUnique({
          where: { id: productId },
          include: {
            category: true,
            images: true,
            merchant: true,
          },
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Error al agregar imágenes al producto');
    }
  }

  async removeImageFromProduct(productId: string, imageId: string, merchantId: string) {
    try {
      // Verificar que el producto pertenece al usuario
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: { images: true },
      });

      if (!product) throw new NotFoundException('Producto no encontrado');
      if (product.merchantId !== merchantId) throw new NotFoundException('No tienes permisos para modificar este producto');

      // Verificar que la imagen pertenece al producto
      const imageExists = product.images.some((img) => img.id === imageId);
      if (!imageExists) throw new NotFoundException('Imagen no encontrada en este producto');

      // Usar transacción para operaciones atómicas
      return await this.prisma.$transaction(async (tx) => {
        // Desconectar la imagen del producto
        await tx.product.update({
          where: { id: productId },
          data: {
            images: {
              disconnect: { id: imageId },
            },
          },
        });

        // Eliminar el archivo usando StorageService
        await this.storageService.remove(imageId);

        // Retornar el producto actualizado
        return tx.product.findUnique({
          where: { id: productId },
          include: {
            category: true,
            images: true,
            merchant: true,
          },
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      console.error('Error al eliminar imagen del producto:', error);
      throw new BadRequestException('Error al eliminar imagen del producto');
    }
  }
}
