import { Controller, Get, Param } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { Public } from '@thallesp/nestjs-better-auth';

@Public()
@Controller('public/categories')
export class PublicCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAllPublic();
  }
}
