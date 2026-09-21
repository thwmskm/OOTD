import { StyleSheet, View, Pressable, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import useUserStore from "../../services/stores/userStore";
import { updateUser } from "../../services/userService";
import { FontAwesome5 } from "@expo/vector-icons";
import AppText from "../components/AppText";
import { colors, spacing, radius } from "../../constants/theme";

const ChangeUsername = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const USERNAME_REGEX = /^[A-Za-z0-9]+$/;

  const [newUsername, setNewUsername] = useState("");

  //save newUsername and check for validation first
  const handleSave = async () => {
    const trimmed = newUsername.trim();

    // empty check
    if (!trimmed) {
      Alert.alert("Username cannot be empty");
      return;
    }

    // length check
    if (trimmed.length < 3 || trimmed.length > 16) {
      Alert.alert("Username must be between 3 and 16 characters");
      return;
    }

    // alphanumeric only, no spaces/punctuation
    if (!USERNAME_REGEX.test(trimmed)) {
      Alert.alert("Username can only contain letters and numbers");
      return;
    }

    // no-op if unchanged
    if (trimmed === user.username) {
      return;
    }

    try {
      await updateUser(user.uid, { username: trimmed });
      setUser("username", trimmed);
      router.back();
    } catch (error) {
      console.error("Error while saving username:", error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.ink} />
        </Pressable>
        <AppText weight="bold" style={styles.headerTitle}>
          Change Username
        </AppText>
        <Pressable onPress={handleSave} hitSlop={8}>
          <FontAwesome5 name="check" size={20} color={colors.sage} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <TextInput
          style={styles.input}
          value={newUsername}
          onChangeText={setNewUsername}
          placeholder={user.username}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
        ></TextInput>
        <AppText weight="regular" style={styles.textWarning}>
          You can only make a change in your username every 14 days.
        </AppText>
      </View>
    </SafeAreaView>
  );
};

export default ChangeUsername;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 16,
    color: colors.ink,
  },
  body: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  input: {
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  textWarning: {
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
    fontSize: 12,
    color: colors.textMuted,
  },
});
