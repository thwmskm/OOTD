import { Text, StyleSheet, View, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FB_auth } from "../../../database/firebase";
import { useState } from "react";
import { createUser } from "../../../services/userService";
import { createUserStats } from "../../../services/userStatsService";
import { storePfp } from "../../../services/Storage";
import useUserStore from "../../../services/stores/userStore"; // ← add

const FinalizeScreen = () => {
  const router = useRouter();
  const { username, pfp } = useLocalSearchParams();
  const loadUser = useUserStore((state) => state.loadUser); // ← add

  const CreateAndContinue = async () => {
    const userId = FB_auth.currentUser.uid;
    const downloadUrl = pfp ? await storePfp(pfp, userId) : "";

    const newUser = {
      uid: userId,
      email: FB_auth.currentUser.email,
      username: username,
      provider: "email",
      pfp: downloadUrl,
      streak: 0,
      MaxStreak: 0,
      lastPostDate: null,
      createdAt: new Date(),
    };

    try {
      await createUser(newUser);
      await createUserStats({
        uid: userId,
        totalOOTDs: 0,
        totalItems: 0,
        styleCounts: {},
        colourCounts: {},
        brandCounts: {},
        itemCounts: {},
        updatedAt: new Date(),
      });
      loadUser(newUser); // ← populate store immediately, don't wait on the listener
    } catch (error) {
      console.error("Firestore write failed:", error.code, error.message);
      return; // ← don't navigate forward on failure, store/doc would be out of sync
    }
    router.replace("/(tabs)");
  };

  return (
    <View>
      <Text>You are all set up {username}!</Text>
      <Button title="to calender" onPress={CreateAndContinue}>
        <Text>Continue</Text>
      </Button>
    </View>
  );
};

export default FinalizeScreen;

const styles = StyleSheet.create({});
