import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { MerchantsModule } from '../merchants/merchants.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicCategoriesController } from './public-categories.controller';

@Module({
  imports: [PrismaModule, MerchantsModule],
  controllers: [CategoriesController, PublicCategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
