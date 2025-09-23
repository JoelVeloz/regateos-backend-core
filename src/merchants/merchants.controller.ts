import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { SearchMerchantDto } from './dto/search-merchant.dto';
import { Public } from '@thallesp/nestjs-better-auth';

@Public()
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  // 1. CREAR merchant
  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Solo se permiten archivos de imagen'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async createMerchant(@Body() createMerchantDto: CreateMerchantDto, @UploadedFiles() files: Express.Multer.File[]) {
    // Organizar archivos por tipo
    const organizedFiles: any = {};
    files?.forEach((file) => {
      const fieldName = file.fieldname;
      if (!organizedFiles[fieldName]) {
        organizedFiles[fieldName] = [];
      }
      organizedFiles[fieldName].push(file);
    });

    return this.merchantsService.createMerchant(createMerchantDto, organizedFiles);
  }

  // 2. VER todos los merchants
  @Get()
  async getAllMerchants(@Query() searchMerchantDto: SearchMerchantDto) {
    return this.merchantsService.getAllMerchants(searchMerchantDto);
  }

  // 3. VER merchant por ID
  @Get(':id')
  async getMerchantById(@Param('id') id: string) {
    return this.merchantsService.getMerchantById(id);
  }

  // 4. VER merchant por userId
  @Get('user/:userId')
  async getMerchantByUserId(@Param('userId') userId: string) {
    return this.merchantsService.getMerchantByUserId(userId);
  }

  // 5. ACTUALIZAR datos del merchant (sin archivos)
  @Patch(':id/data')
  async updateMerchantData(@Param('id') id: string, @Body() updateMerchantDto: UpdateMerchantDto) {
    return this.merchantsService.updateMerchantData(id, updateMerchantDto);
  }

  // 6. ACTUALIZAR archivos del merchant
  @Patch(':id/files')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Solo se permiten archivos de imagen'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async updateMerchantFiles(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    // Organizar archivos por tipo
    const organizedFiles: any = {};
    files?.forEach((file) => {
      const fieldName = file.fieldname;
      if (!organizedFiles[fieldName]) {
        organizedFiles[fieldName] = [];
      }
      organizedFiles[fieldName].push(file);
    });

    return this.merchantsService.updateMerchantFiles(id, organizedFiles);
  }

  // 7. ELIMINAR merchant
  @Delete(':id')
  async deleteMerchant(@Param('id') id: string) {
    return this.merchantsService.deleteMerchant(id);
  }
}
