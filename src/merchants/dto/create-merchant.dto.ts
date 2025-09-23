import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateMerchantDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  businessAddress?: string;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  businessLogoId?: string;

  @IsOptional()
  @IsString()
  nationalIdImageId?: string;

  @IsOptional()
  @IsString()
  storeFrontImageId?: string;
}
