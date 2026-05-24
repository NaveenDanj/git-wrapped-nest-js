import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { GithubUserStat } from './types/gitbub-user-stat';
import { firstValueFrom } from 'rxjs';
import { GithubContributionStat } from './types/github-contribution-stat';

@Injectable()
export class GithubService {
    private readonly baseURL = "https://api.github.com";

    constructor(
        private readonly httpService: HttpService
    ) { }

    async getUserProfile(username: string) {
        try {
            const response = await this.httpService.axiosRef.get(`${this.baseURL}/users/${username}`);
            const { followers, following, public_repos, public_gists, created_at, location, bio } = response.data;
            return <GithubUserStat>{
                followers,
                following,
                public_repos,
                public_gists,
                created_at,
                location,
                bio
            };
        } catch (error) {
            console.error('Error fetching GitHub user profile:', error);
            throw new Error('Failed to fetch GitHub user profile');
        }
    }

    async getContributionStats(username: string, accessToken: string) {

        const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              totalCommitContributions
              totalPullRequestContributions
              totalIssueContributions
              totalRepositoriesWithContributedCommits

              contributionCalendar {
                totalContributions

                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }`;

        const response = await firstValueFrom(
            this.httpService.post(
                'https://api.github.com/graphql',
                {
                    query,
                    variables: {
                        username
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
        );
        return response.data.data.user as GithubContributionStat;
    }

    async getTotalPr(username: string, accessToken: string) {
        const currentYear = new Date().getFullYear();
        const query = `author:${username} is:pr created:${currentYear}-01-01..${currentYear}-12-31`;

        const response = await firstValueFrom(
            this.httpService.get(`${this.baseURL}/search/issues`, {
                params: {
                    q: query,
                },
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
        );

        return response.data;
    }


    async getMergedPr(username: string, accessToken: string) {
        const currentYear = new Date().getFullYear();
        const query = `author:${username} is:pr is:merged created:${currentYear}-01-01..${currentYear}-12-31`;

        const response = await firstValueFrom(
            this.httpService.get(`${this.baseURL}/search/issues`, {
                params: {
                    q: query,
                },
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
        );

        return response.data;
    }

    async getUserRecentEvents(username: string) {
        const response = await this.httpService.axiosRef.get(`${this.baseURL}/users/${username}/events`);
        return response.data;
    }

}
