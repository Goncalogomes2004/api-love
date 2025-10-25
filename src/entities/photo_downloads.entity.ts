import {
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    Index,
} from 'typeorm';
import { Photo } from './photo.entity';
import { User } from './users.entity';

@Entity('photo_downloads')
export class PhotoDownload {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    @Index()
    photo_id: number;

    @Column({ type: 'int' })
    @Index()
    user_id: number;

    @ManyToOne(() => Photo, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'photo_id' })
    photo: Photo;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ type: 'timestamp', name: 'downloaded_at' })
    downloaded_at: Date;

    @Column({ type: 'int', default: 1 })
    numberOfTimes: number;
}
