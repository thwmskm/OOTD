export interface User {
    uid: string;
    email: string;
    username: string;
    provider: 'email' | 'google';
    pfp?: string;
    streak: number;
    MaxStreak: number;
    lastPostDate: string | null;
    createdAt: Date;
}