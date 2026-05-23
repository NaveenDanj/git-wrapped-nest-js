import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";
import { ConfigService } from "@nestjs/config";

export interface GithubUser {
    githubId: string;
    username: string;
    displayName: string;
    email: string;
    avatarURL: string;
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {

    constructor(config: ConfigService) {
        super({
            clientID: config.getOrThrow<string>('GITHUB_CLIENT_ID'),
            clientSecret: config.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
            callbackURL: config.getOrThrow<string>('GITHUB_CALLBACK_URL'),
            scope: ['user:email'],
        });
    }

    validate(accessToken: string, refreshToken: string, profile: any): GithubUser {
        return <GithubUser>{
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatarURL: profile.photos?.[0]?.value,
        }
    }

}