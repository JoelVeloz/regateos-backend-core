import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { PublicProductsFilterDto } from './dto/public-products-filter.dto';
import { Public, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { MerchantsService } from '../merchants/merchants.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly merchantsService: MerchantsService,
  ) {}

  private async getMerchantIdByUserId(userId: string): Promise<string> {
    const merchant = await this.merchantsService.getMerchantByUserId(userId);
    return merchant.id;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images', 10)) // Máximo 10 imágenes
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() images: Express.Multer.File[], @Session() session: UserSession) {
    const merchantId = await this.getMerchantIdByUserId(session.user.id);
    return this.productsService.create(createProductDto, merchantId, images);
  }

  @Get()
  async findAll(@Session() session: UserSession) {
    const merchantId = await this.getMerchantIdByUserId(session.user.id);
    return this.productsService.findAll(merchantId);
  }

  @Public()
  @Get('public')
  findAllPublic(@Query() filter: PublicProductsFilterDto) {
    return this.productsService.findAllPublic(filter);
  }

  @Public()
  @Get('public/:id')
  findOnePublic(@Param('id') id: string) {
    return this.productsService.findOnePublic(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Session() session: UserSession) {
    const merchantId = await this.getMerchantIdByUserId(session.user.id);
    return this.productsService.findOne(id, merchantId);
  }

  @Get('search')
  async search(@Query() searchProductDto: SearchProductDto, @Session() session: UserSession) {
    const merchantId = await this.getMerchantIdByUserId(session.user.id);
    return this.productsService.search(searchProductDto, merchantId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Session() session: UserSession) {
    const merchantId = await this.getMerchantIdByUserId(session.user.id);
    return this.productsService.update(id, updateProductDto, merchantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Session() session: UserSession) {
    const merchantId = await this.getMerchantIdByUserId(session.user.id);
    return this.productsService.remove(id, merchantId);
  }

  // ===== ENDPOINTS PARA MANEJO DE IMÁGENES DE PRODUCTOS =====

  @Post(':id/images')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images', 10)) // Máximo 10 imágenes
  async addImages(@Param('id') productId: string, @UploadedFiles() images: Express.Multer.File[], @Session() session: UserSession) {
    const merchantId = await this.getMerchantIdByUserId(session.user.id);
    return this.productsService.addImagesToProduct(productId, merchantId, images);
  }

  @Delete(':id/images/:imageId')
  @HttpCode(HttpStatus.OK)
  async removeImage(@Param('id') productId: string, @Param('imageId') imageId: string, @Session() session: UserSession) {
    const merchantId = await this.getMerchantIdByUserId(session.user.id);
    const updatedProduct = await this.productsService.removeImageFromProduct(productId, imageId, merchantId);
    return { message: 'Imagen eliminada correctamente', product: updatedProduct };
  }
}
