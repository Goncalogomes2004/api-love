import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoDownload } from 'src/entities/photo_downloads.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhotoDownloadsService {
    constructor(
        @InjectRepository(PhotoDownload) private photoDownloadsRepo: Repository<PhotoDownload>,
    ) { }

    recordDownload(photoId: number, userId: number) {
        const pd = this.photoDownloadsRepo.create({ photo_id: photoId, user_id: userId });
        return this.photoDownloadsRepo.save(pd);
    }

    removeDownload(photoId: number, userId: number) {
        return this.photoDownloadsRepo.delete({ photo_id: photoId, user_id: userId });
    }

    findDownloadsForPhoto(photoId: number) {
        return this.photoDownloadsRepo.find({ where: { photo_id: photoId }, relations: ['user'] });
    }

    findDownloadsForUser(userId: number) {
        return this.photoDownloadsRepo.find({ where: { user_id: userId }, relations: ['photo'] });
    }
}
