import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
@Unique(['username'])
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    username: string;

    @Column({ type: 'varchar', length: 100 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password_hash: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    // Antes de inserir, faz hash da password
    @BeforeInsert()
    async hashPassword() {
        const saltRounds = 10; // podes ajustar
        this.password_hash = await bcrypt.hash(this.password_hash, saltRounds);
    }
}
