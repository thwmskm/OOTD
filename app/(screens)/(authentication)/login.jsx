import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FB_auth } from "../../../database/firebase";
import { guardRateLimit } from "../../../services/rateLimiter";
import { useState } from "react";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import { colors, spacing, radius } from "../../../constants/theme";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    // 5 attempts per 15 min per email
    if (!(await guardRateLimit("login", email.trim().toLowerCase()))) return;

    try {
      await signInWithEmailAndPassword(FB_auth, email, password);
      router.push("/(tabs)");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
        />

        <AppText weight="bold" style={styles.title}>
          Log In
        </AppText>

        <View style={styles.fieldGroup}>
          <AppText weight="medium" style={styles.fieldLabel}>
            Email
          </AppText>
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.textInput}
          />
        </View>

        <View style={styles.fieldGroup}>
          <AppText weight="medium" style={styles.fieldLabel}>
            Password
          </AppText>
          <TextInput
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            style={styles.textInput}
          />
        </View>

        <AppButton
          title="Log in"
          onPress={signIn}
          variant="primary"
          style={styles.loginBtn}
        />

        <Pressable onPress={() => router.push("/register")} hitSlop={8}>
          <AppText weight="regular" style={styles.registerLink}>
            Don't have an account? Sign up
          </AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    color: colors.ink,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.ink,
    fontFamily: "Pretendard_Regular",
  },
  loginBtn: {
    marginTop: spacing.sm,
  },
  registerLink: {
    fontSize: 13,
    color: colors.sage,
    textAlign: "center",
  },
});
