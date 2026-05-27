import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job, Queue } from "bullmq";

@Injectable()
export class WrappedQueueService {

    constructor(
        @InjectQueue('wrapped_jobs')
        private wrappedQueue: Queue
    ) { }

    async generateWrapped(wrappedId: string, username: string, token: string) {

        return this.wrappedQueue.add('generate-wrapped-data', {
            username,
            token,
            wrappedId
        },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000
                }
            });

    }

    async getJob(jobId: string) {
        return this.wrappedQueue.getJob(jobId);
    }

}