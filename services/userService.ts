import { db } from  "../database/firebase.js";
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { User } from "../models/User.js";

const userCollection = collection(db, "users");

//Creating Users
export const createUser = async (user: User) => {
    try {
        const userRef = doc(userCollection, user.uid);
        await setDoc(userRef, user);
        console.log("User Creation Success!");
    } catch (error) {
        console.error("Error while creating user: ", error);
    }
};


//Fetch User
export const getUser = async (uid: string): Promise<User | null> => {
    try {
        const userDoc = await getDoc(doc(userCollection, uid));
        if(userDoc.exists()){
            return userDoc.data() as User;
        }
        else{
            return null;
        }
    } catch (error) {
        console.error("Error fectching user: ", error);
        return null;
    }
};


//Update User data
export const updateUser = async (uid: string, updates: Partial<User>) => {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, updates);
        console.log("User Update Success!");
    } catch (error) {
        console.log("Error while updating user: ", error);
    }
};


//Delete User
export const deleteUser = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
