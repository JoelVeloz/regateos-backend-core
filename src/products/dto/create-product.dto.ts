import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

import { ProductStatus } from '../enums';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountPercent?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discountFixed?: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
