import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job, Queue } from "bullmq";
import { WrappedSlidesStat } from "../../stats/types/wrapped-slides-stat";

@Injectable()
export class WrappedQueueService {

    constructor(
        @InjectQueue('wrapped_jobs')
        private wrappedQueue: Queue
    ) { }

    async generateWrapped(username: string, token: string) {

        return this.wrappedQueue.add('generate-wrapped-data', {
            username,
            token
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