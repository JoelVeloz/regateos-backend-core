import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus, UseInterceptors, UploadedFiles, Patch, Delete } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchDto } from './dto/search.dto';
import { Public, Session, UserSession } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. CREAR usuario (sign up)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'businessLogo', maxCount: 1 },
        { name: 'nationalIdImage', maxCount: 1 },
        { name: 'storeFrontImage', maxCount: 1 },
      ],
      {
        // Usar memoria para mantener el buffer disponible
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB límite por archivo
        },
      },
    ),
  )
  createUser(
    @Body() data: CreateUserDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      businessLogo?: Express.Multer.File[];
      nationalIdImage?: Express.Multer.File[];
      storeFrontImage?: Express.Multer.File[];
    },
  ) {
    return this.usersService.createUser(data, files);
  }

  // 2. VER todos los usuarios
  @Public()
  @Get()
  getAllUsers(@Query() data: SearchDto) {
    return this.usersService.getAllUsers(data);
  }

  // 3. VER usuario por ID
  @Public()
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  // 4. ACTUALIZAR datos del usuario (sin archivos)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateUserData(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.updateUserData(id, data);
  }

  // 5. ACTUALIZAR archivos del usuario
  @Patch(':id/files')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'businessLogo', maxCount: 1 },
        { name: 'nationalIdImage', maxCount: 1 },
        { name: 'storeFrontImage', maxCount: 1 },
      ],
      {
        // Usar memoria para mantener el buffer disponible
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB límite por archivo
        },
      },
    ),
  )
  updateUserFiles(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      businessLogo?: Express.Multer.File[];
      nationalIdImage?: Express.Multer.File[];
      storeFrontImage?: Express.Multer.File[];
    },
  ) {
    return this.usersService.updateUserFiles(id, files);
  }

  // 6. ELIMINAR usuario
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  // ===== ENDPOINTS PARA ARCHIVOS PRIVADOS DE USUARIOS =====
  // Todos los endpoints específicos eliminados - usar directamente StorageController
}
