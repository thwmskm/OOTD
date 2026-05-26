import { StyleSheet, Text, View } from "react-native";
import { Slot, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FB_auth } from "../database/firebase";
import useCheckDailyPost from "./hooks/useCheckDailyPost";
import useUserStore from "../services/stores/userStore";
import { getUser, updateUser } from "../services/userService";
import { router } from "expo-router";
import useStreak from "./hooks/useStreak";

export default function Layout() {
  const [userState, setUserState] = useState(undefined);

  //userStore Initialization
  const user = useUserStore((state) => state.user);
  const loadUser = useUserStore((state) => state.loadUser);
  const resetUserStore = useUserStore((state) => state.resetUserStore);
  const setUser = useUserStore((state) => state.setUser);

  //initialize useStreak hook
  const { checkStreak, resetStreak } = useStreak(user?.uid ?? "");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FB_auth, async (firebaseUser) => {
      setUserState(firebaseUser);

      if (firebaseUser) {
        const userData = await getUser(firebaseUser.uid);
        if (userData) {
          loadUser(userData);
        } else if (firebaseUser === null) {
          setUserState(null);
          resetUserStore();
        }
      }
    });
    return unsubscribe;
  }, []);

  //check the ootd post status
  useCheckDailyPost();

  //check streak and update accordingly
  useEffect(() => {
    if (!user.uid || user.lastPostDate === undefined) return;

    const { dayState } = checkStreak();
    setUser("dayState", dayState);

    if (dayState === "streak_broken") {
      resetStreak();
    }
  }, [user.uid, user.lastPostDate]);

  useEffect(() => {
    if (userState === undefined) return;

    if (userState) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(screens)/(authentication)");
    }
  }, [userState]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(screens)" options={{ headerShown: false }} />
    </Stack>
  );
}
const styles = StyleSheet.create({});
