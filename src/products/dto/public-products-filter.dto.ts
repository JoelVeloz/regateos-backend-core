import { IsOptional, IsUUID } from 'class-validator';

export class PublicProductsFilterDto {
  @IsOptional()
  @IsUUID('4', { message: 'El user_id debe ser un UUID válido' })
  user_id?: string;
}
