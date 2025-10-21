import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { User } from './users.entity';

@Entity('photos')
export class Photo {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    code: string;

    @Column({ type: 'varchar', length: 255 })
    filename: string;

    @Column({ type: 'varchar', length: 255 })
    original_name: string;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'uploaded_by' })
    @Index()    
    uploaded_by: User | null;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'transferred_by' })
    @Index()
    transferred_by: User | null;

    @Column({ type: 'int', default: 0 })
    transfer_number: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at: Date;
}
