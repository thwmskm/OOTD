export interface OOTD {
    id?: string;
    uid: string;
    imageUrl: string;
    date: string; //YYYY-MM-DD
    oid?: string;
    saves?: number;
    caption?: string;
    createdAt: Date;
}