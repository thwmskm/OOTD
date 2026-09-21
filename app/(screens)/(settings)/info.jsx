import { StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { getUser } from "../../../services/userService";
import useUserStore from "../../../services/stores/userStore";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import { colors, spacing, radius } from "../../../constants/theme";

//information on profile like date created, username, , provider, email, potentially password change
const info = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [dateCreated, setDateCreated] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const userData = await getUser(user.uid);
        setProvider(userData.provider);
        const formattedDate = userData.createdAt
          ?.toDate()
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        setDateCreated(formattedDate);
      } catch (error) {
        console.log("Error fetching user info!", error);
      }
    };
    fetchUserData();
  }, []);

  const handlePasswordChange = async () => {};

  //a single label/value row for static account info
  const InfoRow = ({ label, value, last }) => (
    <View style={[styles.row, last && styles.rowLast]}>
      <AppText weight="regular" style={styles.rowLabel}>
        {label}
      </AppText>
      <AppText weight="medium" style={styles.rowValue}>
        {value}
      </AppText>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.ink} />
        </Pressable>
        <AppText weight="bold" style={styles.headerTitle}>
          Info
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        <View style={styles.sections}>
          <InfoRow label="Username" value={user.username} />
          <InfoRow label="Provider" value={provider} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Date Joined" value={dateCreated} last />
        </View>

        <AppButton
          title="Change Password"
          onPress={handlePasswordChange}
          variant="secondary"
          style={styles.passwordButton}
        />
      </View>
    </SafeAreaView>
  );
};

export default info;

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
  sections: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    height: 48,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  rowValue: {
    fontSize: 14,
    color: colors.ink,
  },
  passwordButton: {
    alignSelf: "flex-start",
  },
});
