import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  businessLogo?: string;

  @IsOptional()
  @IsString()
  nationalIdImage?: string;

  @IsOptional()
  @IsString()
  storeFrontImage?: string;

  @IsString()
  businessName: string;

  @IsString()
  businessAddress: string;

  @IsString()
  nationalId: string;

  @IsString()
  city: string;

  @IsString()
  phone: string;
}
