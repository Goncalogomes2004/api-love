import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/users.entity';
import { AuthGuard } from '@nestjs/passport';
class UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
}
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Patch(':id/password')
    async updatePassword(
        @Param('id') id: string,
        @Body() dto: UpdatePasswordDto,
    ) {
        const { currentPassword, newPassword } = dto;
        return this.usersService.updatePassword(Number(id), currentPassword, newPassword);
    }


    @Post()
    create(@Body() user: Partial<User>) {
        return this.usersService.create(user);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateData: Partial<User>) {
        return this.usersService.update(id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
