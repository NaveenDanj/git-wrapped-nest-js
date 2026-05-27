import { Injectable } from '@nestjs/common';
import { WrappedQueueService } from './services/wrapped-queue.service';
import { WrappedRepository } from '../wrapped-data/wrapped-data.repository';

@Injectable()
export class QueueService {

    constructor(
        private readonly wrappedQueue: WrappedQueueService,
        private readonly wrappedDataRepository: WrappedRepository
    ) { }

    async handleWrappedJob(wrappedId: string, username: string, token: string) {
        const res = await this.wrappedQueue.generateWrapped(wrappedId, username, token);
        await this.wrappedDataRepository.updateWrappedJobId(wrappedId, res.id || '');
        return res;
    }

    async handleGetWrappedJobStatus(jobId: string) {
        const res = await this.wrappedQueue.getJob(jobId);
        return res;
    }

}
