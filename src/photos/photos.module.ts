import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Photo } from 'src/entities/photo.entity';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Photo])],
    providers: [PhotosService],
    controllers: [PhotosController],
    exports: [PhotosService],
})
export class PhotosModule { }
