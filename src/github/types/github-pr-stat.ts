export interface GithubPRSMergedtats {
    total_count: number;
    items: PRItem[];
}

export interface GithubPRSOpenedtats {
    total_count: number;
    items: PRItem[];
}


export interface GithubRepo {
    id: number;
    name: string;
    full_name: string;
    owner: {
        login: string;
        id: number;
        avatar_url: string;
        url: string;
    };
    private: boolean;
    description: string;
    fork: boolean;
    forks_count: number;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    open_issues_count: number;
}


interface PRItem {
    id: number;
    created_at: string;
    state: string;
    closed_at: string;
}