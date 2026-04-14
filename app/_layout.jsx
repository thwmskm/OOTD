import { StyleSheet, Text, View } from "react-native";
import { Slot, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FB_auth } from "../database/firebase";
import useCheckDailyPost from "./hooks/useCheckDailyPost";
import { router } from "expo-router";

export default function Layout() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FB_auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  //check the ootd post status
  useCheckDailyPost(user);

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
