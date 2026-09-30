import { StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import { colors, spacing, radius } from "../../../constants/theme";

const StartScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <View style={styles.logoBlock}>
          <AppText weight="bold" style={styles.logo}>
            YU
            <AppText weight="bold" style={styles.logoAccent}>
              *
            </AppText>
            YL
          </AppText>
          <AppText weight="regular" style={styles.tagline}>
            Your daily outfit, for you only
          </AppText>
        </View>

        <View style={styles.actions}>
          <AppButton
            title="Get Started"
            onPress={() => router.push("/register")}
            variant="primary"
          />
          <View style={styles.loginRow}>
            <AppText weight="regular" style={styles.loginText}>
              Already have an account?
            </AppText>
            <Pressable onPress={() => router.push("/login")} hitSlop={8}>
              <AppText weight="medium" style={styles.loginLink}>
                Log in
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  logoBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  logo: {
    fontSize: 40,
    color: colors.ink,
    letterSpacing: 0.5,
  },
  logoAccent: {
    fontSize: 40,
    color: colors.sage,
  },
  tagline: {
    fontSize: 14,
    color: colors.textMuted,
  },
  actions: {
    gap: spacing.md,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  loginText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  loginLink: {
    fontSize: 13,
    color: colors.sage,
  },
});
