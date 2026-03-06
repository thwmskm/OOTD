import { initializeApp } from "@firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage(app);

const FB_auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export { FB_auth };
