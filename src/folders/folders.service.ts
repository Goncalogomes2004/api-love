import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync } from 'fs';
import { join } from 'path';
import { Folder } from 'src/entities/folder.entity';
import { Photo } from 'src/entities/photo.entity';
import { User } from 'src/entities/users.entity';
import { ChangesGateway } from 'src/gateWay/changes.gateway';
import { Repository } from 'typeorm';
import { promises as fs } from "fs";


@Injectable()
export class FoldersService {

    constructor(
        @InjectRepository(Folder) private foldersRepository: Repository<Folder>,
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Photo) private photosRepository: Repository<Photo>,
        private changesGateway: ChangesGateway,

    ) { }
    private readonly uploadDir = join(__dirname, '../../uploads/folders');

    create(folder: Partial<Folder>) {
        const newFolder = this.foldersRepository.create(folder);
        this.changesGateway.sendFolderEdited()
        return this.foldersRepository.save(newFolder);
    }

    async setCoverPhotoCode(id: number, code: string) {
        const folder = await this.foldersRepository.findOne({ where: { id } });
        if (!folder) throw new Error('Folder not found');

        const uploadsPath = join(__dirname, '../../uploads/folders');

        // Remove a imagem antiga, se existir
        if (folder.cover_photo_code) {
            const oldFilePath = join(uploadsPath, folder.cover_photo_code);
            try {
                await fs.unlink(oldFilePath);
            } catch (err) {
                // se o ficheiro não existir, ignora
                if (err.code !== 'ENOENT') {
                    console.error('Erro ao remover capa antiga:', err);
                }
            }
        }

        // Atualiza para a nova capa
        folder.cover_photo_code = code;
        const res = await this.foldersRepository.save(folder);

        // Notifica via WebSocket
        this.changesGateway.sendFolderImageEdited();

        return res;
    }
    getCoverPhotoPath(code: string): string {
        const filePath = join(process.cwd(), 'uploads/folders', code);

        if (!existsSync(filePath)) {
            throw new NotFoundException('Imagem não encontrada');
        }

        return filePath;
    }

    findAll() {
        return this.foldersRepository.find({ relations: ['created_by'] });
    }

    findOne(id: number) {
        return this.foldersRepository.findOne({ where: { id }, relations: ['created_by'] });
    }

    async update(id: number, updateData: Partial<Folder>) {
        const res = await this.foldersRepository.update(id, updateData);
        this.changesGateway.sendFolderEdited()
        return res
    }

    async remove(id: number) {
        const res = await this.foldersRepository.delete(id);
        this.changesGateway.sendFolderEdited()
        return res
    }
}
