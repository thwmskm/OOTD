import { StyleSheet, Text, View } from "react-native";
import { Slot, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FB_auth } from "../database/firebase";
import useCheckDailyPost from "./hooks/useCheckDailyPost";
import useUserStore from "../services/stores/userStore";
import { getUser } from "../services/userService";
import { router } from "expo-router";

export default function Layout() {
  const [user, setUser] = useState(undefined);

  //userStore Initialization
  const loadUser = useUserStore((state) => state.loadUser);
  const resetUserStore = useUserStore((state) => state.resetUserStore);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FB_auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const userData = await getUser(firebaseUser.uid);
        if (userData) {
          loadUser(userData);
        } else if (firebaseUser === null) {
          setUser(null);
          resetUserStore();
        }
      }
    });
    return unsubscribe;
  }, []);

  //check the ootd post status
  useCheckDailyPost();

  useEffect(() => {
    if (user === undefined) return;

    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(screens)/(authentication)");
    }
  }, [user]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
    </Stack>
  );
}
const styles = StyleSheet.create({});
