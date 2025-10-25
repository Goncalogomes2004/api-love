import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from 'src/entities/photo.entity';
import { PhotoDownload } from 'src/entities/photo_downloads.entity';
import { User } from 'src/entities/users.entity';
import { PhotoDownloadsService } from './photo-downloads.service';
import { PhotoDownloadsController } from './photo-downloads.controller';
import { ChangesGateway } from 'src/gateWay/changes.gateway';


@Module({
    imports: [TypeOrmModule.forFeature([PhotoDownload, Photo, User])],
    providers: [PhotoDownloadsService, ChangesGateway],
    controllers: [PhotoDownloadsController],
    exports: [PhotoDownloadsService],
})
export class PhotoDownloadsModule { }
