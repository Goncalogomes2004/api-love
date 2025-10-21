import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from 'src/entities/photo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhotosService {
    constructor(
        @InjectRepository(Photo)
        private photosRepository: Repository<Photo>,
    ) { }

    create(photo: Partial<Photo>) {
        const newPhoto = this.photosRepository.create(photo);
        return this.photosRepository.save(newPhoto);
    }

    findAll() {
        return this.photosRepository.find({ relations: ['uploaded_by', 'transferred_by'] });
    }

    findOne(id: number) {
        return this.photosRepository.findOne({ where: { id }, relations: ['uploaded_by', 'transferred_by'] });
    }

    update(id: number, updateData: Partial<Photo>) {
        return this.photosRepository.update(id, updateData);
    }

    remove(id: number) {
        return this.photosRepository.delete(id);
    }
}
