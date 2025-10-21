import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from 'src/entities/folder.entity';
import { Photo } from 'src/entities/photo.entity';
import { User } from 'src/entities/users.entity';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Folder, User, Photo])],
    providers: [FoldersService],
    controllers: [FoldersController],
    exports: [FoldersService],
})
export class FoldersModule { }
