import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';
import { StatsModule } from '../stats/stats.module';
import { WrappedQueueService } from './services/wrapped-queue.service';
import { WrappedProcessor } from './wrapped.processor';
import { WrappedDataModule } from '../wrapped-data/wrapped-data.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'wrapped_jobs'
    }),
    StatsModule,
    WrappedDataModule
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
