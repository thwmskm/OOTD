export interface User {
    uid?: string;
    email: string;
    username: string;
    provider: 'email' | 'google';
    pfp?: string;
    createdAt: Date;
}