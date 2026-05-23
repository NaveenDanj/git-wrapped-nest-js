import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    githubId: string;

    @Column()
    displayName: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    avatarURL: string;

    @Column({ default: true })
    isActive: boolean;
}