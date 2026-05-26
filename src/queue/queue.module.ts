import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';
import { StatsModule } from '../stats/stats.module';
import { WrappedQueueService } from './services/wrapped-queue.service';
import { WrappedProcessor } from './wrapped.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'wrapped_jobs'
    }),
    StatsModule
  ],
  providers: [
    QueueService,
    WrappedQueueService,
    WrappedProcessor
  ],
  exports: [
    QueueService
  ]
})
export class QueueModule { }
