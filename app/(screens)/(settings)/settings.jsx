import { StyleSheet, View, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { FB_auth } from "../../../database/firebase";
import useOOTDStore from "../../../services/stores/ootdStore";
import useUserStore from "../../../services/stores/userStore";
import { useRouter } from "expo-router";
import AppText from "../../components/AppText";
import { colors, spacing, radius } from "../../../constants/theme";

const Settings = () => {
  const router = useRouter();
  const resetOotdStore = useOOTDStore((state) => state.resetOotdStore);
  const resetUserStore = useUserStore((state) => state.resetUserStore);

  //logout
  const handleLogout = async () => {
    Alert.alert("Logging out?", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          resetOotdStore();
          resetUserStore();
          await FB_auth.signOut();
        },
      },
    ]);
  };

  //a single grouped-list row, with an optional trailing chevron and danger tint
  const Row = ({ label, onPress, danger, last }) => (
    <Pressable
      style={[styles.setting, last && styles.settingLast]}
      onPress={onPress}
    >
      <AppText
        weight="regular"
        style={[styles.settingName, danger && styles.danger]}
      >
        {label}
      </AppText>
      {!danger && (
        <FontAwesome5 name="chevron-right" size={13} color={colors.textMuted} />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.ink} />
        </Pressable>
        <AppText weight="bold" style={styles.headerTitle}>
          Settings
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
      >
        <View style={styles.sections}>
          <AppText weight="medium" style={styles.label}>
            Account
          </AppText>
          <Row label="Info" onPress={() => router.push("/info")} />
          <Row label="Account Privacy" />
          <Row label="Delete Account" danger />
          <Row label="Logout" onPress={handleLogout} danger last />
        </View>

        <View style={styles.sections}>
          <AppText weight="medium" style={styles.label}>
            Preferences
          </AppText>
          <Row label="Turn off Saves" />
          <Row label="Notifications" />
          <Row label="Temperature Unit" last />
        </View>

        <View style={styles.sections}>
          <AppText weight="medium" style={styles.label}>
            YU*YL Customer Services
          </AppText>
          <Row label="FAQ" />
          <Row label="Feedback" last />
        </View>

        <View style={styles.sections}>
          <AppText weight="medium" style={styles.label}>
            Terms of Service
          </AppText>
          <Row label="Service Terms" />
          <Row label="Privacy Policy" last />
        </View>

        <View style={styles.footer}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

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
    flex: 1,
  },
  bodyContent: {
    paddingBottom: spacing.xl,
  },
  sections: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    height: 44,
  },
  settingLast: {
    borderBottomWidth: 0,
  },
  settingName: {
    fontSize: 15,
    color: colors.ink,
  },
  danger: {
    color: colors.blush,
  },
  footer: {
    height: 40,
  },
});
