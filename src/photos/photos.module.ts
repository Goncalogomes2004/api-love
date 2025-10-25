import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Photo } from 'src/entities/photo.entity';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { FolderPhoto } from 'src/entities/folder_photos.entity';
import { ChangesGateway } from 'src/gateWay/changes.gateway';
import { PhotoDownload } from 'src/entities/photo_downloads.entity';
import { User } from 'src/entities/users.entity';
import { Folder } from 'src/entities/folder.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Photo, FolderPhoto, PhotoDownload, User, Folder])],
    providers: [PhotosService, ChangesGateway],
    controllers: [PhotosController],
    exports: [PhotosService],
})
export class PhotosModule { }
