import {
  StyleSheet,
  View,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { FB_auth, functions } from "../../../database/firebase";
import useUserStore from "../../../services/stores/userStore";
import useOOTDStore from "../../../services/stores/ootdStore";
import { useState } from "react";
import { useRouter } from "expo-router";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import { colors, spacing, radius } from "../../../constants/theme";

const CONFIRM_PHRASE = "Delete Account";

//permanently deletes the user's account and all of their data
const deleteAccount = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const resetUserStore = useUserStore((state) => state.resetUserStore);
  const resetOotdStore = useOOTDStore((state) => state.resetOotdStore);

  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  //button only unlocks when the exact phrase is typed and a password is entered
  const canDelete =
    confirmText.trim() === CONFIRM_PHRASE && password.length > 0 && !deleting;

  const handleDelete = async () => {
    if (!user.uid || !canDelete) return;

    setDeleting(true);

    //1. re-authenticate (Firebase requires a recent login to delete an account)
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(FB_auth.currentUser, credential);
    } catch (error) {
      console.error("Re-authentication failed:", error.code, error.message);
      const wrongPassword =
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password";
      Alert.alert(
        wrongPassword ? "Incorrect password" : "Couldn't verify your identity",
        wrongPassword
          ? "The password you entered is incorrect."
          : "Please try again in a moment.",
      );
      setDeleting(false);
      return;
    }

    //2. delete the account and all of its data, then clear local state
    try {
      await httpsCallable(functions, "deleteUserAccount")();
      resetOotdStore();
      resetUserStore();
      await FB_auth.signOut();
    } catch (error) {
      console.error("Failed to delete account:", error);
      Alert.alert(
        "Couldn't delete account",
        "Something went wrong and your account wasn't deleted. Please try again.",
      );
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.ink} />
        </Pressable>
        <AppText weight="bold" style={styles.headerTitle}>
          Delete Account
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.warning}>
          <AppText weight="medium" style={styles.warningTitle}>
            This can't be undone
          </AppText>
          <AppText weight="regular" style={styles.warningText}>
            Deleting your account permanently removes your profile, closet,
            outfits, posts and stats.
          </AppText>
        </View>

        <AppText weight="regular" style={styles.label}>
          Password
        </AppText>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!deleting}
          style={styles.input}
        />

        <AppText weight="regular" style={styles.label}>
          Type "{CONFIRM_PHRASE}" to confirm
        </AppText>
        <TextInput
          value={confirmText}
          onChangeText={setConfirmText}
          placeholder={CONFIRM_PHRASE}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!deleting}
          style={styles.input}
        />

        <AppButton
          title={deleting ? "Deleting..." : "Delete my account"}
          onPress={handleDelete}
          disabled={!canDelete}
          style={styles.deleteButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default deleteAccount;

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
  headerSpacer: {
    width: 20,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  warning: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  warningTitle: {
    fontSize: 14,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  warningText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  input: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    color: colors.ink,
  },
  deleteButton: {
    alignSelf: "flex-start",
  },
});
