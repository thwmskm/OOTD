import { WeatherForecast } from "../services/weatherService";
import type { ClothingSnapshot } from "./ClothingSnapshot";

export interface OOTD {
    id?: string;
    uid: string;
    imageUrl: string;
    date: string; //YYYY-MM-DD
    oid?: string;
    saves?: number | "0";
    likes?: number | "0";
    weather?: WeatherForecast;
    caption?: string;
    style?: string;
    createdAt: Date;
    clothingItems: ClothingSnapshot[];
}