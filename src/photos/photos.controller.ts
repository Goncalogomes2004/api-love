import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, NotFoundException, Res, ParseIntPipe } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { Photo } from 'src/entities/photo.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import { User } from 'src/entities/users.entity';
import type { Response } from 'express';
@Controller('photos')
export class PhotosController {
    constructor(private readonly photosService: PhotosService) { }
    @Post()
    create(@Body() photo: Partial<Photo>) {
        return this.photosService.create(photo);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll() {

        return this.photosService.findAll();
    }


    @Get('/noFolder')
    findWithNoFolder() {

        return this.photosService.findWithNoFolder();
    }

    @Get('/details/:id')
    async getPhotoDetails(@Param('id', ParseIntPipe) id: number) {

        const details = await this.photosService.getPhotoDetails(id);
        if (!details) {
            return { message: 'Foto não encontrada' };
        }
        return details;
    }
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: number) {

        return this.photosService.findOne(id);
    }



    @Get('/image/:photoCode')
    async getImage(@Param('photoCode') photoCode: string, @Res() res: Response) {
        try {

            const imageBuffer = await this.photosService.getImage(photoCode);
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(imageBuffer);
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }



    @UseGuards(AuthGuard('jwt'))
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/photos',
                filename: (req, file, cb) => {
                    const randomName = randomBytes(8).toString('hex');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async uploadPhoto(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ) {
        const uploadedBy =
            body.uploaded_by && !isNaN(Number(body.uploaded_by))
                ? ({ id: Number(body.uploaded_by) } as User)
                : null;

        // Criar objeto parcial
        const photo: Partial<Photo> = {
            code: randomBytes(10).toString('hex'),
            filename: file.filename,
            original_name: file.originalname,
            uploaded_by: uploadedBy,
        };

        // ✅ Salvar no repositório e retornar o resultado
        const newPhoto = await this.photosService.create(photo);
        return newPhoto;
    }
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: number, @Body() updateData: Partial<Photo>) {
        return this.photosService.update(id, updateData);
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.photosService.remove(id);
    }
}
