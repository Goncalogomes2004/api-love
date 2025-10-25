import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import path from 'path';
import { Photo } from 'src/entities/photo.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { FolderPhoto } from 'src/entities/folder_photos.entity';
import { ChangesGateway } from 'src/gateWay/changes.gateway';
import { PhotoDownload } from 'src/entities/photo_downloads.entity';
import { User } from 'src/entities/users.entity';
import { Folder } from 'src/entities/folder.entity';

@Injectable()
export class PhotosService {
    private uploadPath = './uploads/photos';

    constructor(
        @InjectRepository(Photo)
        private photosRepository: Repository<Photo>,
        @InjectRepository(FolderPhoto)
        private folderPhotoRepository: Repository<FolderPhoto>,

        private changesGateway: ChangesGateway,
        @InjectRepository(PhotoDownload) private downloadsRepo: Repository<PhotoDownload>,
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(Folder) private foldersRepo: Repository<Folder>,
    ) { }

    create(photo: Partial<Photo>) {
        const newPhoto = this.photosRepository.create(photo);
        return this.photosRepository.save(newPhoto);
    }




    async getPhotoDetails(photoId: number) {
        // 1️⃣ Buscar info básica da foto
        const photo = await this.photosRepository.findOne({
            where: { id: photoId },
            relations: ['uploaded_by', 'transferred_by'],
        });
        if (!photo) return null;

        // 2️⃣ Buscar pasta(s) da foto
        const folderPhoto = await this.folderPhotoRepository.findOne({
            where: { photo_id: photoId },
            relations: ['folder'],
        });

        // 3️⃣ Buscar downloads
        const downloads = await this.downloadsRepo.find({
            where: { photo_id: photoId },
            relations: ['user'],
        });

        // 4️⃣ Montar resultado
        return {
            id: photo.id,
            code: photo.code,
            filename: photo.filename,
            original_name: photo.original_name,
            created_at: photo.created_at,
            uploaded_by: photo.uploaded_by
                ? { id: photo.uploaded_by.id, name: photo.uploaded_by.username }
                : null,
            transferred_by: photo.transferred_by
                ? { id: photo.transferred_by.id, name: photo.transferred_by.username }
                : null,
            folder: folderPhoto
                ? { id: folderPhoto.folder.id, name: folderPhoto.folder.name }
                : null,
            downloads: downloads.map((d) => ({
                user: { id: d.user.id, name: d.user.username },
                numberOfTimes: d.numberOfTimes,
                lastDownloadedAt: d.downloaded_at,
            })),
        };
    }


    async getImage(code: string): Promise<Buffer> {
        const image = await this.photosRepository.findOne({ where: { code } });
        if (!image || !image.code) {
            throw new NotFoundException('Imagem não encontrada');
        }
        const imagePath = path.join(this.uploadPath, image.filename);

        if (!fs.existsSync(imagePath)) {
            throw new NotFoundException('Imagem não encontrada');
        }

        return fs.readFileSync(imagePath);
    }


    async findWithNoFolder(): Promise<Photo[]> {
        return await this.photosRepository
            .createQueryBuilder('photo')
            .leftJoin(FolderPhoto, 'fp', 'fp.photo_id = photo.id')
            .leftJoinAndSelect('photo.uploaded_by', 'uploaded_by')
            .leftJoinAndSelect('photo.transferred_by', 'transferred_by')
            .where('fp.photo_id IS NULL')
            .getMany();
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

    async remove(id: number) {
        const photo = await this.photosRepository.findOne({ where: { id } });
        if (!photo) {
            throw new NotFoundException('Foto não encontrada');
        }

        const filePath = path.join('./uploads/photos', photo.filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        const res = this.photosRepository.delete(id);
        this.changesGateway.sendNoFolderUpdate();
        return res
    }
}
