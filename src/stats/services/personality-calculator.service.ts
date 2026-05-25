import { Injectable } from '@nestjs/common';
import { WrappedStats } from '../types/wrapped-stats';
import { PERSONALITY_TYPES, PersonalityTypeConfig } from '../constants/personality-types';

interface PersonalityResult {
    personality: PersonalityTypeConfig;
    score: number;
}

@Injectable()
export class PersonalityCalculatorService {

    calculatePersonality(stats: WrappedStats): PersonalityResult {
        const scores = this.calculateScores(stats);
        const winner = this.findWinnerType(scores);

        return {
            personality: PERSONALITY_TYPES[winner],
            score: scores[winner],
        };
    }

    private calculateScores(stats: WrappedStats): Record<string, number> {
        const scores: Record<string, number> = {};

        for (const [type, config] of Object.entries(PERSONALITY_TYPES)) {
            scores[type] = this.calculateTypeScore(stats, config);
        }

        return scores;
    }

    private calculateTypeScore(stats: WrappedStats, config: PersonalityTypeConfig): number {
        const { weights } = config;
        return (
            stats.totalCommits * weights.totalCommits +
            stats.pullRequestsOpened * weights.pullRequestsOpened +
            stats.languagesUsed * weights.languagesUsed +
            stats.reposCreated * weights.reposCreated +
            stats.issuesOpened * weights.issuesOpened +
            stats.PullRequestsMerged * weights.PullRequestsMerged
        );
    }

    private findWinnerType(scores: Record<string, number>): string {
        return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    }
}
