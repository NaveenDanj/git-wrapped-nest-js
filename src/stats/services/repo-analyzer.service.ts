import { Injectable } from '@nestjs/common';
import { GithubService } from '../../github/github.service';
import { GithubRepo } from '../../github/types/github-pr-stat';

interface ActiveRepo {
    repo: string;
    commitCount: number;
}

@Injectable()
export class RepoAnalyzerService {
    private readonly BATCH_SIZE = 5; // Limit concurrent requests to avoid rate limiting

    constructor(private readonly githubService: GithubService) { }

    /**
     * Calculate active repos with batching instead of sequential calls
     * This prevents hitting GitHub API rate limits
     */
    async calculateActiveRepos(
        repos: GithubRepo[],
        username: string,
        accessToken: string,
        limit: number = 5,
    ): Promise<ActiveRepo[]> {
        // Filter non-fork repos
        const nonForkRepos = repos.filter(r => !r.fork);
        if (nonForkRepos.length === 0) return [];

        // Process repos in batches to avoid overwhelming the API
        const activeRepos = await this.processBatch(nonForkRepos, username, accessToken);

        // Sort and return top N
        return activeRepos
            .sort((a, b) => b.commitCount - a.commitCount)
            .slice(0, limit);
    }

    /**
     * Process repos in controlled batches
     */
    private async processBatch(
        repos: GithubRepo[],
        username: string,
        accessToken: string,
    ): Promise<ActiveRepo[]> {
        const results: ActiveRepo[] = [];

        for (let i = 0; i < repos.length; i += this.BATCH_SIZE) {
            const batch = repos.slice(i, i + this.BATCH_SIZE);

            // Process batch in parallel
            const batchResults = await Promise.allSettled(
                batch.map(repo =>
                    this.getRepoCommitCount(repo, username, accessToken),
                ),
            );

            // Extract successful results
            for (const result of batchResults) {
                if (result.status === 'fulfilled' && result.value) {
                    results.push(result.value);
                }
            }
        }

        return results;
    }

    /**
     * Get commit count for a single repo
     */
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
