import { Module } from '@nestjs/common';
import { WrappedService } from './wrapped.service';
import { WrappedController } from './wrapped.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wrapped } from '../wrapped-data/entities/wrapped.entity';
import { AuthModule } from '../auth/auth.module';
import { QueueModule } from '../queue/queue.module';
import { WrappedDataModule } from '../wrapped-data/wrapped-data.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Wrapped]),
    QueueModule,
    WrappedDataModule
  ],
  controllers: [WrappedController],
  providers: [WrappedService],
  exports: [WrappedService]
})
export class WrappedModule { }
