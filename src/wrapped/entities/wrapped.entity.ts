import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wrapped {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    githubUsername: string;

    @Column()
    userId: number;

    @Column()
    title: string;

    @Column()
    year: number;

    @Column('jsonb')
    data: Record<string, any>;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

}
