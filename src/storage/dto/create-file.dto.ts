import { IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @IsOptional()
  @IsString()
  provider?: string; // 'local' | 's3' | 'cloudinary'

  @IsOptional()
  @IsString()
  folder?: string; // 'users' | 'products' | 'files' | etc. (puede venir del multinterceptor)
}
