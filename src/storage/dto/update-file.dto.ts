import { CreateFileDto } from './create-file.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateFileDto extends PartialType(CreateFileDto) {}
