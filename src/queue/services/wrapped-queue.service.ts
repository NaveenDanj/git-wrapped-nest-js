import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class WrappedQueueService {

    constructor(
        @InjectQueue('wrapped_jobs')
        private wrappedQueue: Queue
    ) { }

    async generateWrapped(username: string) {

        return this.wrappedQueue.add('generate-wrapped-data', {
            username
        },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000
                }
            });

    }

}