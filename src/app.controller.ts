import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { GithubService } from './github/github.service';
import { StatsService } from './stats/stats.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly githubService: GithubService,
    private readonly statsService: StatsService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test/:username/:token')
  getTest(@Param('username') username: string, @Param('token') token: string): any {
    return this.statsService.generateWrappedStats(username, token);
  }

}
