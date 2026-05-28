import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    wrappedId: string;

    @Column()
    userId: number;

    @Column()
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

}
