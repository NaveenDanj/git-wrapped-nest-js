import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { StatsService } from "../stats/stats.service";
import { WrappedSlidesStat } from "../stats/types/wrapped-slides-stat";
import { WrappedStatus } from "../wrapped-data/entities/wrapped.entity";
import { WrappedRepository } from "../wrapped-data/wrapped-data.repository";

@Processor('wrapped_jobs')
export class WrappedProcessor extends WorkerHost {

    constructor(
        private readonly statService: StatsService,
        private readonly wrappedRepository: WrappedRepository
    ) {
        super()
    }

    async process(job: Job<{ wrappedId: string, username: string, token: string }, WrappedSlidesStat>): Promise<WrappedSlidesStat> {
        try {

            const wrappedData = await this.statService.generateWrappedStats(job.data.username, job.data.token);
            await job.updateProgress(100);
            await this.wrappedRepository.updateWrappedStatus(job.data.wrappedId, WrappedStatus.COMPLETED);
            await this.wrappedRepository.updateWrappedData(job.data.wrappedId, wrappedData);
            return wrappedData;

        } catch (err) {

            if (job.attemptsMade >= 3) {
                await this.wrappedRepository.updateWrappedStatus(job.data.wrappedId, WrappedStatus.FAILED);
            }

            throw err;
        }
    }

}