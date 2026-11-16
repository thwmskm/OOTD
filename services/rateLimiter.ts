import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const DAY = 24 * 60 * 60_000;

export const RATE_LIMITS = {
  clothingUpload: { max: 10, windowMs: 60_000 },
  outfitUpload: { max: 10, windowMs: 60_000 },
  ootdUpload: { max: 3, windowMs: 60_000 },
  imageReplace: { max: 5, windowMs: 60_000 },
  pfpChange: { max: 3, windowMs: 10 * 60_000 },
  usernameChange: { max: 1, windowMs: 14 * DAY },
  passwordChange: { max: 3, windowMs: 15 * 60_000 },
  login: { max: 5, windowMs: 15 * 60_000 },
  signUp: { max: 3, windowMs: 60 * 60_000 },
} as const;

export type RateLimitAction = keyof typeof RATE_LIMITS;

//Turns a wait in ms into a short readable string
const formatWait = (ms: number): string => {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 24) return `${hours} hr`;
  return `${Math.ceil(hours / 24)} days`;
};

//Returns true if the action is allowed (and records it), false + alert if limited
export const guardRateLimit = async (
  action: RateLimitAction,
  uid: string,
): Promise<boolean> => {
  const { max, windowMs } = RATE_LIMITS[action];
  const storageKey = `rl:${uid}:${action}`;
  const now = Date.now();

  try {
    const raw = await AsyncStorage.getItem(storageKey);
    const stamps: number[] = (raw ? JSON.parse(raw) : []).filter(
      (t: number) => now - t < windowMs,
    );

    if (stamps.length >= max) {
      const wait = formatWait(windowMs - (now - stamps[0]));
      Alert.alert("Slow down", `Too many attempts. Try again in ${wait}.`);
      return false;
    }

    stamps.push(now);
    await AsyncStorage.setItem(storageKey, JSON.stringify(stamps));
    return true;
  } catch (error) {
    //storage failure shouldn't block the user
    console.log("Rate limit check failed:", error);
    return true;
  }
};