import { Injectable } from '@nestjs/common';
import { GithubService } from '../github/github.service';
import { GithubUserStat } from '../github/types/gitbub-user-stat';
import { GithubContributionStat } from '../github/types/github-contribution-stat';
import { GithubPRSMergedtats, GithubPRSOpenedtats, GithubRepo } from '../github/types/github-pr-stat';
import { WrappedStats } from './wrapped-stats';
import { StreakStats } from './types/wrapped-types';
import { WrappedSlidesStat } from './types/wrapped-slides-stat';

@Injectable()
export class StatsService {

    constructor(
        private readonly githubService: GithubService
    ) { }

    async generateWrappedStats(username: string, accessToken: string): Promise<WrappedSlidesStat> {
        const profileStats = await this.githubService.getUserProfile(username);
        const contributionStats = await this.githubService.getContributionStats(username, accessToken);
        const mergedPrStats = await this.githubService.getMergedPr(username, accessToken);
        const totalPrs = await this.githubService.getTotalPr(username, accessToken);

        const introStats = await this.generateIntroStats(profileStats, contributionStats, username);
        const totalActivityStats = await this.generateTotalActivitySlide(contributionStats);
        const streakStats = await this.calcStreaks(contributionStats);
        const languageStats = await this.githubService.getUserLanguages(username);
        const activeRepos = await this.githubService.getUseRepos(username);
        const prStats = await this.calculatePRStats(mergedPrStats, totalPrs);

        const wrappedStats: WrappedStats = {
            totalCommits: contributionStats.contributionsCollection.totalCommitContributions,
            reposCreated: profileStats.public_repos,
            languagesUsed: Object.keys(languageStats).length,
            issuesOpened: contributionStats.contributionsCollection.totalIssueContributions,
            pullRequestsOpened: contributionStats.contributionsCollection.totalPullRequestContributions,
            PullRequestsMerged: mergedPrStats.total_count
        }

        const personality = await this.developerPersonality(wrappedStats);

        return {
            introStats,
            totalActivityStats,
            streakStats,
            languageStats,
            activeRepos,
            prStats,
            personality,
        }


    }

    async generateIntroStats(profileStats: GithubUserStat, contributionStats: GithubContributionStat, username: string) {
        return {
            username,
            avatar: profileStats.profile_avatar,
            followers: profileStats.followers,
            following: profileStats.following,
            public_repos: profileStats.public_repos,
            public_gists: profileStats.public_gists,
            created_at: profileStats.created_at,
            location: profileStats.location,
            totalContributions: this.calcTotalContributions(contributionStats)
        }
    }

    async generateTotalActivitySlide(contributionStats: GithubContributionStat) {
        return {
            totalCommits: contributionStats.contributionsCollection.totalCommitContributions,
            totalPRs: contributionStats.contributionsCollection.totalPullRequestContributions,
            totalIssues: contributionStats.contributionsCollection.totalIssueContributions,
            totalRepoContributedTo: this.calcTotalContributions(contributionStats)
        }
    }



    async calcTotalContributions(contributionStats: GithubContributionStat) {
        return contributionStats.contributionsCollection.totalCommitContributions +
            contributionStats.contributionsCollection.totalPullRequestContributions +
            contributionStats.contributionsCollection.totalIssueContributions +
            contributionStats.contributionsCollection.totalRepositoriesWithContributedCommits;
    }

    async calcStreaks(contributionStats: GithubContributionStat): Promise<StreakStats> {
        let longestStreak = { count: 0, startDate: '', endDate: '' };
        const currentStreak = { count: 0, startDate: '', endDate: '' };
        let activeDays = 0;
        let mostActiveDay = { date: '', count: 0 };

        let tempCurrentStreak = { count: 0, startDate: '', endDate: '' };

        for (const week of contributionStats.contributionsCollection.contributionCalendar.weeks) {
            for (const day of week.contributionDays) {
                if (day.contributionCount > 0) {
                    if (tempCurrentStreak.count === 0) {
                        tempCurrentStreak.startDate = day.date;
                    }
                    tempCurrentStreak.count++;
                    tempCurrentStreak.endDate = day.date;
                    activeDays++;

                    if (day.contributionCount > mostActiveDay.count) {
                        mostActiveDay = { date: day.date, count: day.contributionCount };
                    }

                } else {
                    if (tempCurrentStreak.count > longestStreak.count) {
                        longestStreak = { ...tempCurrentStreak };
                    }
                    tempCurrentStreak = { count: 0, startDate: '', endDate: '' };
                }
            }
        }

        if (tempCurrentStreak.count > longestStreak.count) {
            longestStreak = { ...tempCurrentStreak };
        }

        const lastContributionDay = contributionStats.contributionsCollection.contributionCalendar.weeks
            .flatMap(week => week.contributionDays)
            .reverse()
            .find(day => day.contributionCount > 0);

        if (lastContributionDay) {
            currentStreak.count = tempCurrentStreak.count;
            currentStreak.startDate = tempCurrentStreak.startDate;
            currentStreak.endDate = tempCurrentStreak.endDate;
        }

        return { longestStreak, currentStreak, activeDays, mostActiveDay };
    }

    async calculatePRStats(mergedPrStats: GithubPRSMergedtats, totalPrStats: GithubPRSOpenedtats) {
        const mergedPRCount = mergedPrStats.total_count;
        const totalPRCount = totalPrStats.total_count;
        const mergeRate = totalPRCount > 0 ? (mergedPRCount / totalPRCount) * 100 : 0;

        return {
            mergedPRCount,
            totalPRCount,
            mergeRate: mergeRate.toFixed(2)
        }
    }

    async calculateActiveRepos(repos: GithubRepo[], username: string) {
        const activeRepos: { repo: GithubRepo, commitCount: number }[] = [];

        for (const repo of repos) {
            const response = await this.githubService.getRepoCommits(username, repo.name);
            const userCommitData = response.find((contributor: any) => contributor.login === username);
            if (userCommitData) {
                activeRepos.push({ repo, commitCount: userCommitData.contributions });
            }
        }

        activeRepos.sort((a, b) => b.commitCount - a.commitCount);
        return activeRepos
    }

    async developerPersonality(wrappedStats: WrappedStats) {
        const types = {
            "Builder": { type: 'Builder', description: 'You are a builder who loves to create and contribute to projects. You enjoy seeing your work come to life and making an impact.' },
            "Explorer": { type: 'Explorer', description: 'You are an explorer who loves to discover new technologies and projects. You enjoy learning and experimenting with different tools and frameworks.' },
            "Fixer": { type: 'Fixer', description: 'You are a fixer who loves to solve problems and improve existing projects. You enjoy finding bugs and optimizing code to make things better.' }
        } as const;

        const builder = (wrappedStats.totalCommits * 1) + (wrappedStats.pullRequestsOpened * 0.5);
        const explorer = (wrappedStats.languagesUsed * 5) + (wrappedStats.reposCreated * 2);
        const fixer = (wrappedStats.issuesOpened * 1) + (wrappedStats.PullRequestsMerged * 3);

        const scores = {
            "Builder": builder,
            "Explorer": explorer,
            "Fixer": fixer
        }

        const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as keyof typeof types;
        return {
            personality: types[winner],
            score: scores[winner]
        };

    }

}
