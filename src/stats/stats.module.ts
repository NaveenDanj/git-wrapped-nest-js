import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { GithubModule } from '../github/github.module';

@Module({
  imports: [GithubModule],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule { }
