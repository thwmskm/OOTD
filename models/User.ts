export type TempUnit = "C" | "F";

export interface UserPreferences {
    tempUnit: TempUnit;
    savesEnabled: boolean;
}

export interface User {
    uid: string;
    email: string;
    username: string;
    provider: 'email' | 'google';
    pfp?: string;
    streak: number;
    MaxStreak: number;
    lastPostDate: string | null;
    preferences: UserPreferences;
    createdAt: Date;
}