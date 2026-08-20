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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  const [userState, setUserState] = useState(undefined);
  const [hasProfile, setHasProfile] = useState(undefined);

  //userStore Initialization
  const user = useUserStore((state) => state.user);
  const loadUser = useUserStore((state) => state.loadUser);
  const resetUserStore = useUserStore((state) => state.resetUserStore);
  const setUser = useUserStore((state) => state.setUser);

  //initialize useStreak hook
  const { checkStreak, resetStreak } = useStreak();

  //populate userStore on app launch and check whether this is an existing user profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FB_auth, async (firebaseUser) => {
      setUserState(firebaseUser);

      if (firebaseUser) {
        const userData = await getUser(firebaseUser.uid);
        if (userData) {
          loadUser(userData);
          setHasProfile(true);
        } else {
          resetUserStore();
          setHasProfile(false);
        }
      } else {
        resetUserStore();
        setHasProfile(false); // known state: logged out, not "still checking"
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

  //redirect based on resolved auth + profile state
  useEffect(() => {
    //do nothing until these values are loaded in from firebase
    if (userState === undefined || hasProfile === undefined) return;

    //if user does not exist yet, take them to onboarding/(authentication)
    if (!userState) {
      router.replace("/(screens)/(authentication)");
      return;
    }

    //user profile exists, take them to home screen
    if (hasProfile) {
      router.replace("/(tabs)");
    } else {
      //user profile exists but user has not completed onboarding yet (edge case). Take them to /username to complete the rest of onboarding
      router.replace("/(screens)/(authentication)/username");
    }
  }, [userState, hasProfile]);

  //block rendering any route until auth + profile state is resolved
  //prevents screens from mounting and reading a not-yet-hydrated userStore
  if (userState === undefined || hasProfile === undefined) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({});
