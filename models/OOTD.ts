export interface OOTD {
    id?: string;
    uid: string;
    imageUrl: string;
    date: string; //YYYY-MM-DD
    oid?: string;
    saves?: number | "0";
    likes?: number | "0";
    caption?: string;
    createdAt: Date;
}