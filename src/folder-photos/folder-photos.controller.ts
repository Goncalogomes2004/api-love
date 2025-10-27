// src/folder_photos/folder_photos.controller.ts
import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FolderPhotosService } from './folder-photos.service';
import { ChangesGateway } from 'src/gateWay/changes.gateway';

@UseGuards(AuthGuard('jwt'))
@Controller('folder-photos')
export class FolderPhotosController {
    constructor(private readonly folderPhotosService: FolderPhotosService,
        private changesGateway: ChangesGateway,

    ) { }

    @Post(':folderId')
    async addPhotoToFolder(
        @Param('folderId') folderId: number,
        @Body() photoData: any,
    ) {

        const resp = await this.folderPhotosService.addPhotoToFolder(folderId, photoData);
        this.changesGateway.sendImageEdited(folderId)
        this.changesGateway.sendNoFolderUpdate();


        return resp


    }

    @Get(':folderId')
    findPhotosByFolder(@Param('folderId') folderId: number) {
        return this.folderPhotosService.findPhotosByFolder(folderId);
    }

    @Delete(':folderId/:photoId')
    async removePhotoFromFolder(
        @Param('folderId') folderId: number,
        @Param('photoId') photoId: number,
    ) {
        const resp = await this.folderPhotosService.removePhotoFromFolder(folderId, photoId);
        this.changesGateway.sendImageEdited(folderId)
        this.changesGateway.sendNoFolderUpdate();
        this.changesGateway.sendImageChanged(photoId);

        return resp
    }
}
