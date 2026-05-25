import { Injectable } from '@nestjs/common';
import { GithubService } from '../github/github.service';
import { GithubUserStat } from '../github/types/gitbub-user-stat';
import { GithubContributionStat } from '../github/types/github-contribution-stat';
import { GithubPRSMergedtats, GithubPRSOpenedtats } from '../github/types/github-pr-stat';
import { WrappedStats } from './types/wrapped-stats';
import { WrappedSlidesStat } from './types/wrapped-slides-stat';
import { ContributionCalculatorService } from './services/contribution-calculator.service';
import { RepoAnalyzerService } from './services/repo-analyzer.service';
import { PersonalityCalculatorService } from './services/personality-calculator.service';

@Injectable()
export class StatsService {
    constructor(
        private readonly githubService: GithubService,
        private readonly contributionCalc: ContributionCalculatorService,
        private readonly repoAnalyzer: RepoAnalyzerService,
        private readonly personalityCalc: PersonalityCalculatorService,
    ) { }

    async generateWrappedStats(username: string, accessToken: string): Promise<WrappedSlidesStat> {
        // Fetch all data in parallel instead of sequentially
        const [
            profileStats,
            contributionStats,
            mergedPrStats,
            totalPrs,
            repos,
        ] = await Promise.all([
            this.githubService.getUserProfile(username, accessToken),
            this.githubService.getContributionStats(username, accessToken),
            this.githubService.getMergedPr(username, accessToken),
            this.githubService.getTotalPr(username, accessToken),
            this.githubService.getUseRepos(username, accessToken),
        ]);

        // Calculate stats in parallel using helper methods
        const [
            introStats,
            totalActivityStats,
            streakStats,
            languageStats,
            prStats,
            activeRepos,
        ] = await Promise.all([
            this.generateIntroStats(profileStats, contributionStats, username),
            this.generateTotalActivitySlide(contributionStats),
            Promise.resolve(this.contributionCalc.calculateStreaks(contributionStats)),
            this.githubService.getUserLanguages(username, accessToken),
            this.calculatePRStats(mergedPrStats, totalPrs),
            this.repoAnalyzer.calculateActiveRepos(repos, username, accessToken),
        ]);

        // Build wrapped stats
        const wrappedStats = this.buildWrappedStats(contributionStats, profileStats, languageStats, mergedPrStats);

        // Calculate personality based on all stats
        const personality = this.personalityCalc.calculatePersonality(wrappedStats);

        return {
            introStats,
            totalActivityStats,
            streakStats,
            languageStats,
            prStats,
            personality,
            activeRepos,
        };
    }

    /**
     * Build wrapped stats from contribution data
     */
    private buildWrappedStats(
        contributionStats: GithubContributionStat,
        profileStats: GithubUserStat,
        languageStats: { [key: string]: number },
        mergedPrStats: GithubPRSMergedtats,
    ): WrappedStats {
        return {
            totalCommits: contributionStats.contributionsCollection.totalCommitContributions,
            reposCreated: profileStats.public_repos,
            languagesUsed: Object.keys(languageStats).length,
            issuesOpened: contributionStats.contributionsCollection.totalIssueContributions,
            pullRequestsOpened: contributionStats.contributionsCollection.totalPullRequestContributions,
            PullRequestsMerged: mergedPrStats.total_count,
        };
    }

    async generateIntroStats(profileStats: GithubUserStat, contributionStats: GithubContributionStat, username: string) {
        const totalContributions = this.contributionCalc.calculateTotalContributions(contributionStats);
        return {
            username,
            avatar: profileStats.profile_avatar,
            followers: profileStats.followers,
            following: profileStats.following,
            public_repos: profileStats.public_repos,
            public_gists: profileStats.public_gists,
            created_at: profileStats.created_at,
            location: profileStats.location,
            totalContributions,
        };
    }

    async generateTotalActivitySlide(contributionStats: GithubContributionStat) {
        const totalRepoContributedTo = this.contributionCalc.calculateTotalContributions(contributionStats);
        return {
            totalCommits: contributionStats.contributionsCollection.totalCommitContributions,
            totalPRs: contributionStats.contributionsCollection.totalPullRequestContributions,
            totalIssues: contributionStats.contributionsCollection.totalIssueContributions,
            totalRepoContributedTo,
        };
    }



    async calculatePRStats(mergedPrStats: GithubPRSMergedtats, totalPrStats: GithubPRSOpenedtats) {
        const mergedPRCount = mergedPrStats.total_count;
        const totalPRCount = totalPrStats.total_count;
        const mergeRate = totalPRCount > 0 ? (mergedPRCount / totalPRCount) * 100 : 0;

        return {
            mergedPRCount,
            totalPRCount,
            mergeRate: mergeRate.toFixed(2),
        };
    }
}
