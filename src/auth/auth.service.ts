import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Utilizador não encontrado 💔');

        const passwordValid = await bcrypt.compare(password, user.password_hash);
        if (!passwordValid) throw new UnauthorizedException('Palavra-passe incorreta 💔');

        return user;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);

        const payload = { sub: user.id, email: user.email, username: user.username };
        const token = this.jwtService.sign(payload);

        return {
            message: '💖 Login efetuado com sucesso!',
            access_token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        };
    }
}
