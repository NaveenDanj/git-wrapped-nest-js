import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'wrapped_jobs'
    })
  ],
  providers: [QueueService],
})
export class QueueModule { }
