import type { ClothingSnapshot } from "./ClothingSnapshot";

export interface Outfit {
    oid?: string;
    uid: string;
    clothingItems: ClothingSnapshot[];       //List of clothing items
    imageUrl: string;
    style?: string;
    season?: "Spring" | "Summer" | "Autumn" | "Winter" | "All Year";
    occasion?: string;
    favourite: boolean;
    createdAt: Date;
}