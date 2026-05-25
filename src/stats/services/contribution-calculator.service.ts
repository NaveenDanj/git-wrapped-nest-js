import { Injectable } from '@nestjs/common';
import { GithubContributionStat } from '../../github/types/github-contribution-stat';
import { StreakStats } from '../types/wrapped-types';

@Injectable()
export class ContributionCalculatorService {
    private getContributionCollection(stats: GithubContributionStat) {
        return stats.contributionsCollection;
    }

    calculateTotalContributions(stats: GithubContributionStat): number {
        const collection = this.getContributionCollection(stats);
        return (
            collection.totalCommitContributions +
            collection.totalPullRequestContributions +
            collection.totalIssueContributions +
            collection.totalRepositoriesWithContributedCommits
        );
    }

    calculateStreaks(stats: GithubContributionStat): StreakStats {
        const weeks = this.getContributionCollection(stats).contributionCalendar.weeks;

        let longestStreak = { count: 0, startDate: '', endDate: '' };
        let tempCurrentStreak = { count: 0, startDate: '', endDate: '' };
        let activeDays = 0;
        let mostActiveDay = { date: '', count: 0 };
        let currentStreak = { count: 0, startDate: '', endDate: '' };

        for (const week of weeks) {
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

        const allDays = weeks.flatMap(w => w.contributionDays);
        const lastContributionDay = [...allDays].reverse().find(d => d.contributionCount > 0);
        if (lastContributionDay) {
            currentStreak = { ...tempCurrentStreak };
        }

        return { longestStreak, currentStreak, activeDays, mostActiveDay };
    }
}
