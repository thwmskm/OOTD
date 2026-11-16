import { db } from  "../database/firebase.js";
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { Clothing } from "../models/Clothing.js";

const clothingCollection = collection(db, "clothings");

//Creating Clothings
//Batched with a users/{uid}.lastClothingAt stamp, which the Firestore rules require
export const createClothing = async (clothing: Clothing) => {
    try {
        const batch = writeBatch(db);
        batch.set(doc(clothingCollection, clothing.cid), clothing);
        batch.update(doc(db, "users", clothing.uid), {
            lastClothingAt: serverTimestamp(),
        });
        await batch.commit();
        console.log("Clothing Creation Success!");
    } catch (error) {
        console.error("Error while creating clothing: ", error);
    }
};


//Fetch Clothing
export const getClothing = async (cid: string): Promise<Clothing | null> => {
    try {
        const clothingDoc = await getDoc(doc(clothingCollection, cid));
        if(clothingDoc.exists()){
            return clothingDoc.data() as Clothing;
        }
        else{
            return null;
        }
    } catch (error) {
        console.error("Error fectching clothing: ", error);
        return null;
    }
};


//Update Clothing data
export const updateClothing = async (cid: string, updates: Partial<Clothing>) => {
    try {
        const clothingRef = doc(db, "clothings", cid);
        await updateDoc(clothingRef, updates);
        console.log("Clothing Update Success!");
    } catch (error) {
        console.log("Error while updating clothing: ", error);
    }
};


//Delete Clothing
export const deleteClothing = async (cid: string) => {
  try {
    const clothingRef = doc(db, "clothings", cid);
    await deleteDoc(clothingRef);
    console.log("Clothing deleted successfully!");
  } catch (error) {
    console.error("Error deleting clothing:", error);
  }
};