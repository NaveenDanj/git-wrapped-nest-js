import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GithubUser } from './github.strategy';

export interface JwtUser {
  id: number;
  username: string;
  accessToken: string;
}

export interface RequestWithGithubUser extends Request {
  user: GithubUser;
}

export interface RequestWithJwtUser extends Request {
  user: JwtUser;
}

export type RequestWithUser = RequestWithGithubUser | RequestWithJwtUser;

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
  async getProfile(@Req() req: RequestWithJwtUser) {
    const token = req.user.accessToken;
    const user = await this.authService.getCurrentUser(req.user.username);
    return { user, token };
  }

  @Get("github/callback")
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Req() req: RequestWithGithubUser) {
    return this.authService.loginWithGithub(req.user);
  }

}
