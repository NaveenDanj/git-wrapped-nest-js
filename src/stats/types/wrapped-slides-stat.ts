import { GithubRepo } from "../../github/types/github-pr-stat";
import { StreakStats } from "./wrapped-types";


export interface PersonalityType {
    readonly type: 'Builder' | 'Explorer' | 'Fixer';
    readonly description: string;
}

export interface WrappedSlidesStat {
    introStats: IntroStats;
    totalActivityStats: TotalActivityStats;
    streakStats: StreakStats;
    languageStats: { [key: string]: number; };
    activeRepos: GithubRepo[];
    prStats: PRStats;
    personality: { personality: PersonalityType; score: number };
}

export interface IntroStats {
    username: string;
    avatar: string;
    followers: number;
    following: number;
    public_repos: number;
    public_gists: number;
    created_at: string;
    location: string;
    totalContributions: Promise<number>;
}

export interface TotalActivityStats {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalRepoContributedTo: Promise<number>;
}

export interface PRStats {
    mergedPRCount: number;
    totalPRCount: number;
    mergeRate: string;
}