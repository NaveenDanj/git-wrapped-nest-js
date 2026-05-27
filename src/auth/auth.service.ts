import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { GithubUser } from './github.strategy';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

@Injectable()
export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) { }

  async loginWithGithub(githubUser: GithubUser) {
    const user = await this.findOrCreateUser(githubUser);
    const token = this.jwtService.sign({ sub: user.id, username: user.username, accessToken: githubUser.accessToken });
    return { token, user, accessToken: githubUser.accessToken };
  }

  async getCurrentUser(username: string) {
    const user = await this.authRepository.findByUsername(username);
    return user;
  }

  async findOrCreateUser(githubUser: GithubUser) {
    const existingUser = await this.authRepository.findByEmail(githubUser.email);

    if (existingUser) {
      return existingUser;
    }

    const newUser = await this.authRepository.createUser({
      displayName: githubUser.displayName,
      username: githubUser.username,
      email: githubUser.email,
      githubId: githubUser.githubId,
      avatarURL: githubUser.avatarURL,
    })

    return newUser;
  }

}
