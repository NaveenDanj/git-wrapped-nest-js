export interface PersonalityTypeConfig {
    type: 'Builder' | 'Explorer' | 'Fixer';
    description: string;
    weights: {
        totalCommits: number;
        pullRequestsOpened: number;
        languagesUsed: number;
        reposCreated: number;
        issuesOpened: number;
        PullRequestsMerged: number;
    };
}

export const PERSONALITY_TYPES: Record<string, PersonalityTypeConfig> = {
    Builder: {
        type: 'Builder',
        description: 'You are a builder who loves to create and contribute to projects. You enjoy seeing your work come to life and making an impact.',
        weights: {
            totalCommits: 1,
            pullRequestsOpened: 0.5,
            languagesUsed: 0,
            reposCreated: 0,
            issuesOpened: 0,
            PullRequestsMerged: 0,
        },
    },
    Explorer: {
        type: 'Explorer',
        description: 'You are an explorer who loves to discover new technologies and projects. You enjoy learning and experimenting with different tools and frameworks.',
        weights: {
            totalCommits: 0,
            pullRequestsOpened: 0,
            languagesUsed: 5,
            reposCreated: 2,
            issuesOpened: 0,
            PullRequestsMerged: 0,
        },
    },
    Fixer: {
        type: 'Fixer',
        description: 'You are a fixer who loves to solve problems and improve existing projects. You enjoy finding bugs and optimizing code to make things better.',
        weights: {
            totalCommits: 0,
            pullRequestsOpened: 0,
            languagesUsed: 0,
            reposCreated: 0,
            issuesOpened: 1,
            PullRequestsMerged: 3,
        },
    },
};
