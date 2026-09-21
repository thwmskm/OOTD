import { StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FB_auth } from "../database/firebase";
import useCheckDailyPost from "./hooks/useCheckDailyPost";
import useUserStore from "../services/stores/userStore";
import { getUser } from "../services/userService";
import useStreak from "./hooks/useStreak";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const router = useRouter();
  const [userState, setUserState] = useState(undefined);
  const [hasProfile, setHasProfile] = useState(undefined);

  const [fontsLoaded, fontError] = useFonts({
    Pretendard_Bold: require("../assets/fonts/Pretendard-Bold.ttf"),
    Pretendard_Medium: require("../assets/fonts/Pretendard-Medium.ttf"),
    Pretendard_Regular: require("../assets/fonts/Pretendard-Regular.ttf"),
  });

  const user = useUserStore((state) => state.user);
  const loadUser = useUserStore((state) => state.loadUser);
  const resetUserStore = useUserStore((state) => state.resetUserStore);
  const setUser = useUserStore((state) => state.setUser);

  const { checkStreak, resetStreak } = useStreak();

  // auth + profile resolution
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FB_auth, async (firebaseUser) => {
      setUserState(firebaseUser);

      //user is found
      if (firebaseUser) {
        const userData = await getUser(firebaseUser.uid);
        //user has profile to load
        if (userData) {
          loadUser(userData);
          setHasProfile(true);
        }
        //user does not profile yet
        else {
          resetUserStore();
          setHasProfile(false);
        }
      }
      //user does not exist
      else {
        resetUserStore();
        setHasProfile(false);
      }
    });
    return unsubscribe;
  }, []);

  useCheckDailyPost();

  //check streak
  useEffect(() => {
    if (!user.uid || user.lastPostDate === undefined) return;

    const { dayState } = checkStreak();

    if (dayState !== user.dayState) {
      setUser("dayState", dayState);
    }

    if (dayState === "streak_broken" && user.streak !== 0) {
      resetStreak();
    }
  }, [user.uid, user.lastPostDate]);

  const ready =
    (fontsLoaded || fontError) &&
    userState !== undefined &&
    hasProfile !== undefined;

  // hide splash once ready
  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  //navigate to specific screen based on the auth state (New user, registered but account not set up (edge case), signed in user)
  useEffect(() => {
    if (!ready) return;

    if (!userState) {
      router.replace("/(screens)/(authentication)");
    } else if (!hasProfile) {
      router.replace("/(screens)/(authentication)/username");
    } else {
      router.replace("/(tabs)");
    }
  }, [ready, userState, hasProfile]);

  if (!ready) {
    return null; //splash stays up while data loads
  }

  return (
    <GestureHandlerRootView>
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
