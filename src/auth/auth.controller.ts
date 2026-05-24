import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GithubUser } from './github.strategy';

interface RequestWithUser extends Request {
  user: GithubUser;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get("sample")
  async sample() {
    return { message: "This is a sample route" };
  }

  @Get("github")
  @UseGuards(AuthGuard('github'))
  async githubLogin() {
    // This route will redirect the user to GitHub for authentication
  }

  @Get("me")
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: RequestWithUser) {
    return this.authService.getCurrentUser(req.user.username);
  }

  @Get("github/callback")
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Req() req: RequestWithUser) {
    return this.authService.loginWithGithub(req.user);
  }

}
