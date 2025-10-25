import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


// MODULES
import { UsersModule } from './users/users.module';
import { FoldersModule } from './folders/folders.module';
import { PhotosModule } from './photos/photos.module';
import { FolderPhotosModule } from './folder-photos/folder-photos.module';
import { PhotoDownloadsModule } from './photo-downloads/photo-downloads.module';
import { User } from './entities/users.entity';
import { Folder } from './entities/folder.entity';
import { Photo } from './entities/photo.entity';
import { FolderPhoto } from './entities/folder_photos.entity';
import { PhotoDownload } from './entities/photo_downloads.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'love_user',
      password: 'Fofoque-Plinio-vedico8',
      database: 'love',
      entities: [User, Folder, Photo, FolderPhoto, PhotoDownload],
      synchronize: true,
    }),
    // NestJS feature modules
    UsersModule,
    FoldersModule,
    PhotosModule,
    FolderPhotosModule,
    PhotoDownloadsModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
