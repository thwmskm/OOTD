export interface UserStats {
    uid: string;
    totalOOTDs: number;                         //ootd
    styleCounts?: Record<string, number>;      //ootd     
    colourCounts?: Record<string, number>;     //ootd
    brandCounts?: Record<string, number>;      //clothingItem
    itemCounts?: Record<string, number>;       //clothingItem
    updatedAt: Date;
};