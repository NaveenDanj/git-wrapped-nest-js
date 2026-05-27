import { Module } from '@nestjs/common';
import { WrappedRepository } from './wrapped-data.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wrapped } from './entities/wrapped.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wrapped]),
  ],
  providers: [WrappedRepository],
  exports: [WrappedRepository]
})
export class WrappedDataModule { }
