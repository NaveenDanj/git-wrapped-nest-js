import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum WrappedType {
    YEARLY = 'yearly',
    MONTHLY = 'monthly',
    WEEKLY = 'weekly',
    DAILY = 'daily'
}

export enum WrappedStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

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

    @Column({
        type: 'enum',
        enum: WrappedType,
        default: WrappedType.YEARLY
    })
    type: WrappedType;

    @Column({
        type: 'enum',
        enum: WrappedStatus,
        default: WrappedStatus.PENDING
    })
    status: WrappedStatus;

    @Column()
    year: number;

    @Column({
        nullable: true
    })
    jobId: string;

    @Column({
        type: 'jsonb',
        nullable: true
    })
    data: Record<string, any>;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

}
