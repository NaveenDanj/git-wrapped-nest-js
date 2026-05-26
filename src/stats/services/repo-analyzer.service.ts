import { Injectable } from '@nestjs/common';
import { GithubService } from '../../github/github.service';
import { GithubRepo } from '../../github/types/github-pr-stat';

interface ActiveRepo {
    repo: string;
    commitCount: number;
}

@Injectable()
export class RepoAnalyzerService {
    private readonly BATCH_SIZE = 5;

    constructor(private readonly githubService: GithubService) { }

    async calculateActiveRepos(
        repos: GithubRepo[],
        username: string,
        accessToken: string,
        limit: number = 5,
    ): Promise<ActiveRepo[]> {
        const nonForkRepos = repos.filter(r => !r.fork);
        if (nonForkRepos.length === 0) return [];

        const activeRepos = await this.processBatch(nonForkRepos, username, accessToken);

        return activeRepos
            .sort((a, b) => b.commitCount - a.commitCount)
            .slice(0, limit);
    }

    private async processBatch(
        repos: GithubRepo[],
        username: string,
        accessToken: string,
    ): Promise<ActiveRepo[]> {
        const results: ActiveRepo[] = [];

        for (let i = 0; i < repos.length; i += this.BATCH_SIZE) {
            const batch = repos.slice(i, i + this.BATCH_SIZE);

            const batchResults = await Promise.allSettled(
                batch.map(repo =>
                    this.getRepoCommitCount(repo, username, accessToken),
                ),
            );

            for (const result of batchResults) {
                if (result.status === 'fulfilled' && result.value) {
                    results.push(result.value);
                }
            }
        }

        return results;
    }

    private async getRepoCommitCount(
        repo: GithubRepo,
        username: string,
        accessToken: string,
    ): Promise<ActiveRepo | null> {
        try {
            const contributors = await this.githubService.getRepoCommits(
                username,
                repo.name,
                accessToken,
            );

            const userCommits = contributors.find(
                c => c.login.toLowerCase() === username.toLowerCase(),
            );

            return userCommits
                ? { repo: repo.name, commitCount: userCommits.contributions }
                : null;
        } catch (error) {
            console.error(`Failed to fetch commits for ${repo.name}:`, error);
            return null;
        }
    }
}
