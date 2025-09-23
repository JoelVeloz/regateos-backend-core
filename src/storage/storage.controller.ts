import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { StorageService } from './storage.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Public } from '@thallesp/nestjs-better-auth';

@Public()
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('serve/:id')
  async servePublicFileById(@Param('id') id: string, @Res({ passthrough: false }) res: Response): Promise<void> {
    try {
      const fileData = await this.storageService.servePublicFileById(id);

      // Configurar headers para servir el archivo
      res.set({
        'Content-Type': fileData.mimeType,
        'Content-Length': fileData.size.toString(),
        'Content-Disposition': `inline; filename="${fileData.originalName}"`,
        'Cache-Control': 'public, max-age=31536000', // Cache por 1 año
      });

      // Enviar el archivo
      res.send(fileData.buffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: 'Archivo no encontrado' });
      } else {
        res.status(500).json({ message: 'Error al servir el archivo' });
      }
    }
  }

  // ===== ENDPOINTS PRIVADOS (CRUD) =====
  // delete
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.storageService.remove(id);
  }
}
