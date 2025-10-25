import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }




    async updatePassword(userId: number, currentPassword: string, newPassword: string) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }

        // Verifica se a password atual confere
        const passwordMatches = await bcrypt.compare(currentPassword, user.password_hash);
        if (!passwordMatches) {
            throw new Error('Password atual incorreta');
        }

        // Atualiza a password
        const saltRounds = 10;
        const hashed = await bcrypt.hash(newPassword, saltRounds);
        user.password_hash = hashed;

        return this.usersRepository.save(user);
    }




    findByEmail(email: string) {
        return this.usersRepository.findOne({
            where: {
                email
            }
        })
    }
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
