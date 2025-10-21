import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from 'src/entities/folder.entity';
import { FolderPhoto } from 'src/entities/folder_photos.entity';
import { Photo } from 'src/entities/photo.entity';
import { Repository } from 'typeorm';


@Injectable()
export class FolderPhotosService {
    constructor(
        @InjectRepository(FolderPhoto) private folderPhotosRepo: Repository<FolderPhoto>,
        @InjectRepository(Folder) private foldersRepo: Repository<Folder>,
        @InjectRepository(Photo) private photosRepo: Repository<Photo>,
    ) { }

    addPhotoToFolder(folderId: number, photoId: number) {
        const fp = this.folderPhotosRepo.create({ folder_id: folderId, photo_id: photoId });
        return this.folderPhotosRepo.save(fp);
    }

    removePhotoFromFolder(folderId: number, photoId: number) {
        return this.folderPhotosRepo.delete({ folder_id: folderId, photo_id: photoId });
    }

    findPhotosInFolder(folderId: number) {
        return this.folderPhotosRepo.find({ where: { folder_id: folderId }, relations: ['photo'] });
    }
}
