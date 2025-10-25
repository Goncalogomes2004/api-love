import { Controller, Get, Post, Body, Param, Put, Delete, Req, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { Folder } from 'src/entities/folder.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { use } from 'passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { existsSync } from 'fs';
import type { Response } from 'express';
@UseGuards(AuthGuard('jwt'))
@Controller('folders')
export class FoldersController {
    constructor(private readonly foldersService: FoldersService, @InjectRepository(User) private usersRepository: Repository<User>,
    ) { }
    @Post()
    async create(@Body() folder: Partial<Folder>) {
        return this.foldersService.create({
            ...folder,
        });
    }

    @Post(':id/upload-cover')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/folders', // pasta para salvar imagens
                filename: (req, file, cb) => {
                    const uniqueSuffix = uuidv4() + extname(file.originalname);
                    cb(null, uniqueSuffix);
                },
            }),
        }),
    )
    async uploadCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        const code = file.filename; // o "código" será o filename
        return this.foldersService.setCoverPhotoCode(+id, code);
    }



    @Get('cover/:code')
    async getCoverPhoto(@Param('code') code: string, @Res() res: Response) {
        try {
            const filePath = this.foldersService.getCoverPhotoPath(code);
            return res.sendFile(filePath, { root: '/' }); // garante que o caminho absoluto é respeitado
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }


    @Get()
    findAll() {
        return this.foldersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.foldersService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateData: Partial<Folder>) {
        return this.foldersService.update(id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.foldersService.remove(id);
    }
}
