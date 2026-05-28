import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { GithubUserStat } from './types/gitbub-user-stat';
import { firstValueFrom } from 'rxjs';
import { GithubContributionStat } from './types/github-contribution-stat';
import { GithubPRSMergedtats, GithubPRSOpenedtats, GithubRepo } from './types/github-pr-stat';
import { GithubCommitStats } from './types/github-commits';

@Injectable()
export class GithubService {
    private readonly baseURL = "https://api.github.com";

    constructor(
        private readonly httpService: HttpService
    ) { }

    async getUserProfile(username: string, accessToken: string) {
        try {
            const response = await this.httpService.axiosRef.get(`${this.baseURL}/users/${username}`, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
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
            throw new HttpException('Failed to fetch GitHub user profile', 400);
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

    async getRepoCommits(username: string, repo: string, accessToken: string) {
        const response = await this.httpService.axiosRef.get(`${this.baseURL}/repos/${username}/${repo}/contributors`, {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const out: GithubCommitStats[] = []
        for (const contributor of response.data) {
            out.push({
                login: contributor.login,
                contributions: contributor.contributions
            });
        }
        return out;
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

        return response.data as GithubPRSOpenedtats;
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

        return response.data as GithubPRSMergedtats;
    }

    async getUseRepos(username: string, accessToken: string) {
        let page = 1;
        const perPage = 100;
        let repos: GithubRepo[] = [];
        while (true) {
            const response = await this.httpService.axiosRef.get(`${this.baseURL}/users/${username}/repos`, {
                params: {
                    page,
                    per_page: perPage,
                },
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            repos.push(...response.data as GithubRepo[]);
            if (response.data.length < perPage) {
                break;
            }
            page++;
        }
        return repos;
    }

    async getRepoLanguages(owner: string, repo: string, accessToken: string) {
        const response = await this.httpService.axiosRef.get(`${this.baseURL}/repos/${owner}/${repo}/languages`, {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data as { [key: string]: number };
    }

    async getUserLanguages(username: string, accessToken: string) {
        const repos = await this.getUseRepos(username, accessToken);
        const languageCount: { [key: string]: number } = {};
        for (const repo of repos) {
            const languages = await this.getRepoLanguages(repo.owner.login, repo.name, accessToken);
            for (const [language, count] of Object.entries(languages)) {
                languageCount[language] = (languageCount[language] || 0) + count;
            }
        }
        return languageCount;
    }

    async getUserRecentEvents(username: string, accessToken: string) {
        const response = await this.httpService.axiosRef.get(`${this.baseURL}/users/${username}/events`, {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }

}
