// src/folder_photos/folder_photos.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FolderPhoto } from 'src/entities/folder_photos.entity';
import { Photo } from 'src/entities/photo.entity';
import { Folder } from 'src/entities/folder.entity';

@Injectable()
export class FolderPhotosService {
    constructor(
        @InjectRepository(FolderPhoto)
        private folderPhotosRepo: Repository<FolderPhoto>,
        @InjectRepository(Photo)
        private photosRepo: Repository<Photo>,
        @InjectRepository(Folder)
        private foldersRepo: Repository<Folder>,
    ) { }

    async addPhotoToFolder(folderId: number, photoData: Partial<Photo>) {
        // 1. Criar a foto


        // 2. Criar relação folder-photo
        const relation = this.folderPhotosRepo.create({
            folder_id: folderId,
            photo_id: photoData.id,
        });

        await this.folderPhotosRepo.save(relation);
        return photoData;
    }

    async findPhotosByFolder(folderId: number) {
        const relations = await this.folderPhotosRepo.find({
            where: { folder_id: folderId },
            relations: ['photo', 'photo.uploaded_by'],
        });

        return relations.map((r) => r.photo);
    }

    async removePhotoFromFolder(folderId: number, photoId: number) {
        await this.folderPhotosRepo.delete({ folder_id: folderId, photo_id: photoId });
        // opcional: deletar a photo em si, se não estiver em outras pastas
    }
}
