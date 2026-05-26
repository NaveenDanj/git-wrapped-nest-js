import { Injectable } from '@nestjs/common';
import { WrappedQueueService } from './services/wrapped-queue.service';

@Injectable()
export class QueueService {

    constructor(
        private readonly wrappedQueue: WrappedQueueService
    ) { }

    async handleWrappedJob(username: string, token: string) {
        const res = await this.wrappedQueue.generateWrapped(username, token);
        return res;
    }

    async handleGetWrappedJobStatus(jobId: string) {
        const res = await this.wrappedQueue.getJob(jobId);
        return res;
    }

}
