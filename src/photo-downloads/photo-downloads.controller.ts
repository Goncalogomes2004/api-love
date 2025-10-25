import { Controller, Post, Delete, Get, Param } from '@nestjs/common';
import { PhotoDownloadsService } from './photo-downloads.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';



@UseGuards(AuthGuard('jwt'))

@Controller('photo-downloads')
export class PhotoDownloadsController {
    constructor(private readonly photoDownloadsService: PhotoDownloadsService) { }

    @Post(':photoId/:userId')
    record(@Param('photoId') photoId: number, @Param('userId') userId: number) {
        return this.photoDownloadsService.recordDownload(photoId, userId);
    }

    @Delete(':photoId/:userId')
    remove(@Param('photoId') photoId: number, @Param('userId') userId: number) {
        return this.photoDownloadsService.removeDownload(photoId, userId);
    }

    @Get('photo/:photoId')
    downloadsForPhoto(@Param('photoId') photoId: number) {
        return this.photoDownloadsService.findDownloadsForPhoto(photoId);
    }

    @Get('user/:userId')
    downloadsForUser(@Param('userId') userId: number) {
        return this.photoDownloadsService.findDownloadsForUser(userId);
    }
}
