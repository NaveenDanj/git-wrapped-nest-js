import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { StatsService } from "../stats/stats.service";
import { WrappedSlidesStat } from "../stats/types/wrapped-slides-stat";

@Processor('wrapped_jobs')
export class WrappedProcessor extends WorkerHost {

    constructor(
        private readonly statService: StatsService
    ) {
        super()
    }

    async process(job: Job<{ username: string, token: string }, WrappedSlidesStat>): Promise<WrappedSlidesStat> {
        const wrappedData = await this.statService.generateWrappedStats(job.data.username, job.data.token);
        await job.updateProgress(100);
        return wrappedData;
    }

}