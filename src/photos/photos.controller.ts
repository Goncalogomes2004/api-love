import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { Photo } from 'src/entities/photo.entity';

@Controller('photos')
export class PhotosController {
    constructor(private readonly photosService: PhotosService) { }

    @Post()
    create(@Body() photo: Partial<Photo>) {
        return this.photosService.create(photo);
    }

    @Get()
    findAll() {
        return this.photosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.photosService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateData: Partial<Photo>) {
        return this.photosService.update(id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.photosService.remove(id);
    }
}
