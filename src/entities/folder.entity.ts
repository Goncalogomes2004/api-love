import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { User } from './users.entity';

@Entity('folders')
export class Folder {
    @PrimaryGeneratedColumn('increment') // <--- agora é INT auto-increment
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    @Index()
    created_by: User;

    @Column({ type: 'varchar', length: 100, nullable: true })
    cover_photo_code: string | null;

    // timestamps
    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

}
