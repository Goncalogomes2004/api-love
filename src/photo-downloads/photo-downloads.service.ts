import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoDownload } from 'src/entities/photo_downloads.entity';
import { ChangesGateway } from 'src/gateWay/changes.gateway';
import { Repository } from 'typeorm';

@Injectable()
export class PhotoDownloadsService {
    constructor(
        @InjectRepository(PhotoDownload) private photoDownloadsRepo: Repository<PhotoDownload>,

        private changesGateway: ChangesGateway,
    ) { }
    async recordDownload(photoId: number, userId: number) {
        const alreadyExists = await this.photoDownloadsRepo.findOne({
            where: {
                photo_id: photoId,
                user_id: userId
            }
        })

        if (alreadyExists) {
            alreadyExists.numberOfTimes = alreadyExists.numberOfTimes + 1
            const res = this.photoDownloadsRepo.update(alreadyExists.id, alreadyExists)
            this.changesGateway.sendDowloaded(photoId)
            return res
        } else {
            const pd = this.photoDownloadsRepo.create({ photo_id: photoId, user_id: userId, numberOfTimes: 1 });
            this.changesGateway.sendDowloaded(photoId)

            return this.photoDownloadsRepo.save(pd);
        }
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
