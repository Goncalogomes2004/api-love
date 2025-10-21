import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { Folder } from 'src/entities/folder.entity';

@Controller('folders')
export class FoldersController {
    constructor(private readonly foldersService: FoldersService) { }

    @Post()
    create(@Body() folder: Partial<Folder>) {
        return this.foldersService.create(folder);
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
