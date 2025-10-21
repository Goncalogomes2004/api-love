import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    create(user: Partial<User>) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    findAll() {
        return this.usersRepository.find();
    }

    findOne(id: number) {
        return this.usersRepository.findOne({ where: { id } });
    }

    update(id: number, updateData: Partial<User>) {
        return this.usersRepository.update(id, updateData);
    }

    remove(id: string) {
        return this.usersRepository.delete(id);
    }
}
