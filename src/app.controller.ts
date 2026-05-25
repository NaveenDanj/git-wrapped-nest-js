import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { GithubService } from './github/github.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly githubService: GithubService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test/:username/:token')
  getTest(@Param('username') username: string, @Param('token') token: string): any {
    return this.githubService.getMergedPr(username, token);
  }

}
