import { db } from  "../database/firebase.js";
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { OOTD } from "../models/OOTD.js";

const ootdCollection = collection(db, "ootds");

//Creating OOTDs
export const createOOTD = async (ootd: OOTD) => {
    try {
        const ootdRef = doc(ootdCollection, ootd.id);
        await setDoc(ootdRef, ootd);
        console.log("OOTD Creation Success!");
    } catch (error) {
        console.error("Error while creating ootd: ", error);
    }
};


//Fetch OOTD
export const getOOTD = async (id: string): Promise<OOTD | null> => {
    try {
        const ootdDoc = await getDoc(doc(ootdCollection, id));
        if(ootdDoc.exists()){
            return ootdDoc.data() as OOTD;
        }
        else{
            return null;
        }
    } catch (error) {
        console.error("Error fectching ootd: ", error);
        return null;
    }
};


//Update OOTD data
export const updateOOTD = async (id: string, updates: Partial<OOTD>) => {
    try {
        const ootdRef = doc(db, "ootds", id);
        await updateDoc(ootdRef, updates);
        console.log("OOTD Update Success!");
    } catch (error) {
        console.log("Error while updating ootd: ", error);
    }
};


//Delete OOTD
export const deleteOOTD = async (id: string) => {
  try {
    const ootdRef = doc(db, "ootds", id);
    await deleteDoc(ootdRef);
    console.log("OOTD deleted successfully");
  } catch (error) {
    console.error("Error deleting ootd:", error);
  }
};
