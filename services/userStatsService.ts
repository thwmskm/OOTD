import { db } from "../database/firebase.js";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  increment,
  writeBatch,
} from "firebase/firestore";
import { UserStats } from "../models/UserStats.js";

const userStatsCollection = collection(db, "userStats");

//Creating UserStats (called once, e.g. alongside createUser)
export const createUserStats = async (userStats: UserStats) => {
  try {
    const userStatsRef = doc(userStatsCollection, userStats.uid);
    await setDoc(userStatsRef, userStats);
    console.log("UserStats Creation Success!");
  } catch (error) {
    console.error("Error while creating userStats: ", error);
    throw error;
  }
};

//Fetch UserStats
export const getUserStats = async (uid: string): Promise<UserStats | null> => {
  try {
    const userStatsDoc = await getDoc(doc(userStatsCollection, uid));
    if (userStatsDoc.exists()) {
      return userStatsDoc.data() as UserStats;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching userStats: ", error);
    throw error;
  }
};

//Update UserStats data (direct field overwrite, e.g. non-counter fields)
export const updateUserStats = async (
  uid: string,
  updates: Partial<UserStats>,
) => {
  try {
    const userStatsRef = doc(db, "userStats", uid);
    await updateDoc(userStatsRef, { ...updates, updatedAt: new Date() });
    console.log("UserStats Update Success!");
  } catch (error) {
    console.error("Error while updating userStats: ", error);
    throw error;
  }
};

//Delete UserStats
export const deleteUserStats = async (uid: string) => {
  try {
    const userStatsRef = doc(db, "userStats", uid);
    await deleteDoc(userStatsRef);
    console.log("UserStats deleted successfully");
  } catch (error) {
    console.error("Error deleting userStats:", error);
    throw error;
  }
};

//Atomically increment totalOOTDs by a delta (default +1, pass -1 on OOTD delete)
export const incrementTotalOOTDs = async (uid: string, delta: number = 1) => {
  try {
    const userStatsRef = doc(db, "userStats", uid);
    await updateDoc(userStatsRef, {
      totalOOTDs: increment(delta),
      updatedAt: new Date(),
    });
    console.log("totalOOTDs increment success!");
  } catch (error) {
    console.error("Error incrementing totalOOTDs: ", error);
    throw error;
  }
};

//Atomically increment a single key within one of the count maps
//field: "styleCounts" | "colourCounts" | "brandCounts" | "itemCounts"
//key: the specific label/id within that map, e.g. "casual" or a colour label
export const incrementStatCount = async (
  uid: string,
  field: "styleCounts" | "colourCounts" | "brandCounts" | "itemCounts",
  key: string,
  delta: number = 1,
) => {
  try {
    const userStatsRef = doc(db, "userStats", uid);
    await updateDoc(userStatsRef, {
      [`${field}.${key}`]: increment(delta),
      updatedAt: new Date(),
    });
    console.log(`${field}.${key} increment success!`);
  } catch (error) {
    console.error(`Error incrementing ${field}.${key}: `, error);
    throw error;
  }
};

//Atomically increment multiple keys within one count map, in a single batch.
//Duplicate keys in `keys` are tallied first so repeated occurrences (e.g. two
//items both "black") apply their own delta each, rather than the last write
//to that field path silently overwriting the earlier one.
export const incrementStatCounts = async (
  uid: string,
  field: "styleCounts" | "colourCounts" | "brandCounts" | "itemCounts",
  keys: string[],
  delta: number = 1,
) => {
  if (!keys.length) return;

  try {
    //tally occurrences of each key first: { black: 2, white: 1 }
    const tally: Record<string, number> = {};
    for (const key of keys) {
      tally[key] = (tally[key] ?? 0) + delta;
    }

    const batch = writeBatch(db);
    const userStatsRef = doc(db, "userStats", uid);
    const updates: Record<string, any> = { updatedAt: new Date() };
    for (const [key, count] of Object.entries(tally)) {
      updates[`${field}.${key}`] = increment(count);
    }

    batch.update(userStatsRef, updates);
    await batch.commit();
    console.log(`${field} batch increment success!`);
  } catch (error) {
    console.error(`Error batch incrementing ${field}: `, error);
    throw error;
  }
};