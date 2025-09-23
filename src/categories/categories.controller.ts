import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { MerchantsService } from '../merchants/merchants.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly merchantsService: MerchantsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto, @Session() session: UserSession) {
    const merchant = await this.merchantsService.getMerchantByUserId(session.user.id);
    return this.categoriesService.create(createCategoryDto, merchant.id);
  }

  @Get()
  async findAll(@Session() session: UserSession) {
    const merchant = await this.merchantsService.getMerchantByUserId(session.user.id);
    return this.categoriesService.findAll(merchant.id);
  }

  @Get('search')
  async search(@Query() searchCategoryDto: SearchCategoryDto, @Session() session: UserSession) {
    const merchant = await this.merchantsService.getMerchantByUserId(session.user.id);
    return this.categoriesService.search(searchCategoryDto, merchant.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Session() session: UserSession) {
    const merchant = await this.merchantsService.getMerchantByUserId(session.user.id);
    return this.categoriesService.findOne(id, merchant.id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Session() session: UserSession) {
    const merchant = await this.merchantsService.getMerchantByUserId(session.user.id);
    return this.categoriesService.update(id, updateCategoryDto, merchant.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Session() session: UserSession) {
    const merchant = await this.merchantsService.getMerchantByUserId(session.user.id);
    return this.categoriesService.remove(id, merchant.id);
  }
}
