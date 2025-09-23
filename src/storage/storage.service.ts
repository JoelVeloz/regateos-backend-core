import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateFileDto } from './dto/create-file.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageLocalService } from './storage-local.service';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class StorageService {
  constructor(
    private prisma: PrismaService,
    private storageLocalService: StorageLocalService,
  ) {}

  // ===== CRUD BÁSICO =====

  // 1. CREATE - Crear archivo
  async create(createFileDto: CreateFileDto, file: Express.Multer.File) {
    try {
      // Validar que el archivo sea válido
      if (!file) {
        throw new BadRequestException('No se proporcionó archivo');
      }

      if (!file.originalname) {
        throw new BadRequestException('El archivo no tiene nombre original');
      }

      if (!file.mimetype) {
        throw new BadRequestException('El archivo no tiene tipo MIME válido');
      }

      if (!file.size || file.size <= 0) {
        throw new BadRequestException('El archivo está vacío o tiene tamaño inválido');
      }

      // El folder puede venir del DTO o del nombre del campo del multinterceptor
      const folder = createFileDto.folder || file.fieldname || 'files';

      // Crear registro en base de datos primero para obtener el ID
      const fileRecord = await this.prisma.file.create({
        data: {
          filename: '', // Se actualizará después con el ID
          originalName: file.originalname,
          path: '', // Se actualizará después
          url: '', // Se actualizará después
          provider: createFileDto.provider || 'local',
          mimeType: file.mimetype,
          size: file.size,
        },
        include: { product: true },
      });

      // Usar el ID del registro como nombre del archivo
      const filename = fileRecord.id;
      const extension = file.originalname.split('.').pop() || '';
      const filenameWithExtension = extension ? `${filename}.${extension}` : filename;

      // Crear path basado en el folder, las carpetas se crean automáticamente
      const folderPath = `${folder}/${filenameWithExtension}`;
      const path = `/uploads/${folderPath}`;
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const url = `${baseUrl}/storage/serve/${fileRecord.id}`;

      // Actualizar el registro con el path y filename correctos
      const updatedFileRecord = await this.prisma.file.update({
        where: { id: fileRecord.id },
        data: {
          filename: filenameWithExtension,
          path,
          url,
        },
        include: { product: true },
      });

      // Guardar archivo físicamente usando StorageLocalService
      await this.storageLocalService.saveFile(file, path);

      return updatedFileRecord;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al crear el archivo');
    }
  }

  // 2. READ - Leer archivo por ID
  async findOne(id: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!file) throw new NotFoundException('Archivo no encontrado');

    return file;
  }

  // 3. READ - Leer todos los archivos
  async findAll() {
    return this.prisma.file.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 4. UPDATE - Actualizar archivo
  async update(id: string, updateFileDto: UpdateFileDto) {
    try {
      // Verificar que el archivo existe
      const existingFile = await this.prisma.file.findUnique({ where: { id } });

      if (!existingFile) throw new NotFoundException('Archivo no encontrado');

      const file = await this.prisma.file.update({
        where: { id },
        data: updateFileDto,
        include: { product: true },
      });

      return file;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Error al actualizar el archivo');
    }
  }

  // 5. DELETE - Eliminar archivo
  async remove(id: string, tx?: Parameters<Parameters<PrismaService['$transaction']>[0]>[0]) {
    try {
      const prismaClient = tx || this.prisma;

      // Verificar que el archivo existe
      const existingFile = await prismaClient.file.findUnique({ where: { id } });

      if (!existingFile) throw new NotFoundException('Archivo no encontrado');

      // Eliminar archivo físicamente usando StorageLocalService
      await this.storageLocalService.deleteFile(existingFile.path);

      // Eliminar registro de base de datos
      await prismaClient.file.delete({ where: { id } });

      return { message: 'Archivo eliminado correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Error al eliminar el archivo');
    }
  }

  // ===== MÉTODOS PÚBLICOS =====
  async findAllPublic() {
    return this.prisma.file.findMany({
      where: {
        // Solo archivos públicos (sin restricciones de usuario)
        // Aquí podrías agregar lógica para determinar qué archivos son públicos
      },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOnePublic(id: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!file) {
      throw new NotFoundException('Archivo no encontrado');
    }

    // Aquí podrías agregar lógica para verificar si el archivo es público
    return file;
  }

  async servePublicFileById(id: string) {
    // Buscar por ID del registro
    const file = await this.prisma.file.findUnique({
      where: { id: id },
    });

    if (!file) {
      throw new NotFoundException('Archivo no encontrado');
    }

    // Leer el archivo del sistema de archivos
    const fileBuffer = await this.storageLocalService.readFile(file.path);

    return {
      buffer: fileBuffer,
      mimeType: file.mimeType,
      originalName: file.originalName,
      size: file.size,
    };
  }
}
