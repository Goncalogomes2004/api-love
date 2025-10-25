import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from 'src/entities/folder.entity';
import { FolderPhoto } from 'src/entities/folder_photos.entity';
import { Photo } from 'src/entities/photo.entity';
import { FolderPhotosService } from './folder-photos.service';
import { FolderPhotosController } from './folder-photos.controller';
import { ChangesGateway } from 'src/gateWay/changes.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([FolderPhoto, Folder, Photo])],
    providers: [FolderPhotosService, ChangesGateway],
    controllers: [FolderPhotosController],
    exports: [FolderPhotosService],
})
export class FolderPhotosModule { }
