import { BadRequestException, Injectable } from '@nestjs/common';
import { dirname, join } from 'path';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';

import { existsSync } from 'fs';

@Injectable()
export class StorageLocalService {
  // Guardar archivo en el sistema de archivos local
  async saveFile(file: Express.Multer.File, filePath: string): Promise<void> {
    try {
      // Validar que el archivo y su buffer existan
      if (!file) {
        throw new BadRequestException('No se proporcionó archivo');
      }

      if (!file.buffer) {
        throw new BadRequestException('El archivo no contiene datos válidos');
      }

      if (!Buffer.isBuffer(file.buffer)) {
        throw new BadRequestException('Los datos del archivo no son válidos');
      }

      // Crear la ruta completa del archivo
      const fullPath = join(process.cwd(), 'files', filePath.replace('/uploads/', ''));

      // Crear directorio automáticamente basándose en las barras del path
      const directory = dirname(fullPath);
      await mkdir(directory, { recursive: true });

      // Escribir el archivo
      await writeFile(fullPath, file.buffer);
    } catch (error) {
      throw new BadRequestException(`Error al guardar el archivo: ${error.message}`);
    }
  }

  // Eliminar archivo del sistema de archivos local
  async deleteFile(filePath: string): Promise<void> {
    try {
      // Crear la ruta completa del archivo
      const fullPath = join(process.cwd(), 'files', filePath.replace('/uploads/', ''));

      // Verificar si el archivo existe antes de eliminarlo
      if (existsSync(fullPath)) {
        await unlink(fullPath);
      }
    } catch (error) {
      // No lanzar error si el archivo no existe
      console.warn(`Advertencia: No se pudo eliminar el archivo ${filePath}: ${error.message}`);
    }
  }

  // Obtener la ruta completa de un archivo
  getFullPath(filePath: string): string {
    return join(process.cwd(), 'files', filePath.replace('/uploads/', ''));
  }

  // Verificar si un archivo existe
  fileExists(filePath: string): boolean {
    const fullPath = this.getFullPath(filePath);
    return existsSync(fullPath);
  }

  // Leer archivo del sistema de archivos local
  async readFile(filePath: string): Promise<Buffer> {
    try {
      const fullPath = this.getFullPath(filePath);

      if (!existsSync(fullPath)) {
        throw new BadRequestException('Archivo no encontrado');
      }

      return await readFile(fullPath);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(`Error al leer el archivo: ${error.message}`);
    }
  }

  // Obtener información del archivo
  async getFileInfo(filePath: string) {
    try {
      const fullPath = this.getFullPath(filePath);

      if (!existsSync(fullPath)) {
        return null;
      }

      const { stat } = await import('fs/promises');
      const stats = await stat(fullPath);

      return {
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener información del archivo: ${error.message}`);
    }
  }

  // Crear directorio si no existe
  async ensureDirectoryExists(directoryPath: string): Promise<void> {
    try {
      const fullPath = join(process.cwd(), 'files', directoryPath);

      if (!existsSync(fullPath)) {
        await mkdir(fullPath, { recursive: true });
      }
    } catch (error) {
      throw new BadRequestException(`Error al crear directorio: ${error.message}`);
    }
  }

  // Limpiar archivos huérfanos (archivos sin registro en BD)
  async cleanupOrphanedFiles(): Promise<{ deleted: number; errors: string[] }> {
    const results = { deleted: 0, errors: [] as string[] };

    try {
      const { readdir, stat } = await import('fs/promises');
      const filesDir = join(process.cwd(), 'files');

      if (!existsSync(filesDir)) {
        return results;
      }

      // Recorrer recursivamente todos los archivos
      const scanDirectory = async (dir: string): Promise<void> => {
        const items = await readdir(dir);

        for (const item of items) {
          const itemPath = join(dir, item);
          const stats = await stat(itemPath);

          if (stats.isDirectory()) {
            await scanDirectory(itemPath);
          } else if (stats.isFile()) {
            // Aquí podrías verificar si el archivo tiene registro en BD
            // Por ahora solo contamos los archivos
            results.deleted++;
          }
        }
      };

      await scanDirectory(filesDir);
    } catch (error) {
      results.errors.push(`Error en limpieza: ${error.message}`);
    }

    return results;
  }
}
