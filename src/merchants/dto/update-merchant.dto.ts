import { CreateMerchantDto } from './create-merchant.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMerchantDto extends PartialType(CreateMerchantDto) {}
