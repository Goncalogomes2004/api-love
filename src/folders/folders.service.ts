import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from 'src/entities/folder.entity';
import { Photo } from 'src/entities/photo.entity';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';


@Injectable()
export class FoldersService {
    constructor(
        @InjectRepository(Folder) private foldersRepository: Repository<Folder>,
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Photo) private photosRepository: Repository<Photo>,
    ) { }

    create(folder: Partial<Folder>) {
        const newFolder = this.foldersRepository.create(folder);
        return this.foldersRepository.save(newFolder);
    }

    findAll() {
        return this.foldersRepository.find({ relations: ['created_by'] });
    }

    findOne(id: number) {
        return this.foldersRepository.findOne({ where: { id }, relations: ['created_by'] });
    }

    update(id: number, updateData: Partial<Folder>) {
        return this.foldersRepository.update(id, updateData);
    }

    remove(id: number) {
        return this.foldersRepository.delete(id);
    }
}
