import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { GithubModule } from '../github/github.module';
import { ContributionCalculatorService } from './services/contribution-calculator.service';
import { RepoAnalyzerService } from './services/repo-analyzer.service';
import { PersonalityCalculatorService } from './services/personality-calculator.service';

@Module({
  imports: [GithubModule],
  providers: [
    StatsService,
    ContributionCalculatorService,
    RepoAnalyzerService,
    PersonalityCalculatorService,
  ],
  exports: [StatsService],
})
export class StatsModule { }
