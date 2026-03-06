import { Clothing } from "./Clothing";

export interface ClothingSnapshot {
    cid: string;
    imageUrl: string;
    type?: Clothing["type"];
    colour?: string;
    brand?: string;
}