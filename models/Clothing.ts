export interface Clothing {
    cid: string;
    uid: string;
    imageUrl: string;
    colour?: string;
    brand?: string;
    material?: string;
    season?: "Spring" | "Summer" | "Autumn" | "Winter" | "All Year";
    type?: "Top" | "Bottom" | "One piece" | "Shoes" | "Hat" | "Accessory";
    inOut?:  "Indoor" | "Outdoor";
    favourite: boolean;
    createdAt: Date;
}