import { StyleSheet, View, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FB_auth } from "../../../database/firebase";
import { useState } from "react";
import { createUser } from "../../../services/userService";
import { createUserStats } from "../../../services/userStatsService";
import { storePfp } from "../../../services/Storage";
import useUserStore from "../../../services/stores/userStore"; // ← add
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import { colors, spacing } from "../../../constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";

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
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={styles.backBtn}
      >
        <FontAwesome5 name="arrow-left" size={20} color={colors.ink} />
      </Pressable>
      <AppText weight="bold" style={styles.title}>
        You are all set up {username}!
      </AppText>
      <AppButton
        title="to calender"
        onPress={CreateAndContinue}
        variant="primary"
      />
    </View>
  );
};

export default FinalizeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.paper,
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    color: colors.ink,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
});
