import { Controller, Post, Delete, Get, Param } from '@nestjs/common';
import { FolderPhotosService } from './folder-photos.service';

@Controller('folder-photos')
export class FolderPhotosController {
    constructor(private readonly folderPhotosService: FolderPhotosService) { }

    @Post(':folderId/:photoId')
    addPhoto(@Param('folderId') folderId: number, @Param('photoId') photoId: number) {
        return this.folderPhotosService.addPhotoToFolder(folderId, photoId);
    }

    @Delete(':folderId/:photoId')
    removePhoto(@Param('folderId') folderId: number, @Param('photoId') photoId: number) {
        return this.folderPhotosService.removePhotoFromFolder(folderId, photoId);
    }

    @Get(':folderId')
    getPhotos(@Param('folderId') folderId: number) {
        return this.folderPhotosService.findPhotosInFolder(folderId);
    }
}
