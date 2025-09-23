import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageController } from './storage.controller';
import { StorageLocalService } from './storage-local.service';
import { StorageService } from './storage.service';

@Module({
  imports: [PrismaModule],
  controllers: [StorageController],
  providers: [StorageService, StorageLocalService],
  exports: [StorageService, StorageLocalService],
})
export class StorageModule {}
