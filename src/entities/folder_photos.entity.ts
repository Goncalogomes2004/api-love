// folder_photos.entity.ts
import {
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
    Index,
} from 'typeorm';
import { Folder } from './folder.entity';
import { Photo } from './photo.entity';

@Entity('folder_photos')
export class FolderPhoto {
    @PrimaryColumn({ type: 'int' })
    @Index()
    folder_id: number;

    @PrimaryColumn({ type: 'int' })
    @Index()
    photo_id: number;

    @ManyToOne(() => Folder, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'folder_id' })
    folder: Folder;

    @ManyToOne(() => Photo, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'photo_id' })
    photo: Photo;
}
