
export interface StreakStats {
    activeDays: number;
    longestStreak: {
        count: number;
        startDate: string;
        endDate: string;
    };
    currentStreak: {
        count: number;
        startDate: string;
        endDate: string;
    };
    mostActiveDay: {
        date: string;
        count: number;
    };
}