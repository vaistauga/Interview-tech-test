import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { File } from './entities/file.entity';
import { FileService } from './services/file.service';
import { FileStorageService } from './services/file-storage.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([File]),
    ConfigModule,
  ],
  controllers: [],
  providers: [
    FileService,
    FileStorageService,
  ],
  exports: [
    FileService,
    FileStorageService,
  ],
})
export class FilesModule {} 