import { db } from  "../database/firebase.js";
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Outfit } from "../models/Outfit.js";

const outfitCollection = collection(db, "outfits");

//Creating Outfit
export const createOutfit = async (outfit: Outfit) => {
    try {
        const outfitRef = doc(outfitCollection, outfit.oid);
        await setDoc(outfitRef, outfit);
        console.log("Outfit Creation Success!");
    } catch (error) {
        console.error("Error while creating outfit: ", error);
    }
};


//Fetch Outfit
export const getOutfit = async (oid: string): Promise<Outfit | null> => {
    try {
        const outfitDoc = await getDoc(doc(outfitCollection, oid));
        if(outfitDoc.exists()){
            return outfitDoc.data() as Outfit;
        }
        else{
            return null;
        }
    } catch (error) {
        console.error("Error fectching outfit: ", error);
        return null;
    }
};


//Update Outfit data
export const updateOutfit = async (oid: string, updates: Partial<Outfit>) => {
    try {
        const outfitRef = doc(db, "outfits", oid);
        await updateDoc(outfitRef, updates);
        console.log("Outfit Update Success!");
    } catch (error) {
        console.log("Error while updating outfit: ", error);
    }
};


//Delete Outfit
export const deleteOutfit = async (oid: string) => {
  try {
    const outfitRef = doc(db, "outfits", oid);
    await deleteDoc(outfitRef);
    console.log("Outfit deleted successfully");
  } catch (error) {
    console.error("Error deleting outfit:", error);
  }
};
