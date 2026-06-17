export interface UserStats {
    uid: string;
    totalOOTDs: number;
    styleCounts?: Record<string, number>;       
    colourCounts?: Record<string, number>;     
    brandCounts?: Record<string, number>;      
    itemCounts?: Record<string, number>;       
    updatedAt: Date;
};