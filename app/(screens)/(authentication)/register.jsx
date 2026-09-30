import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FB_auth } from "../../../database/firebase";
import { useState } from "react";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import { colors, spacing, radius } from "../../../constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(FB_auth, email, password);
      router.replace("/username");
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
        ></Pressable>
        <AppText weight="bold" style={styles.title}>
          Sign Up
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
          ></TextInput>
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
          ></TextInput>
        </View>

        <AppButton
          title="Sign up"
          onPress={signUp}
          variant="primary"
          style={styles.signUpBtn}
        />

        <Pressable onPress={() => router.push("/login")} hitSlop={8}>
          <AppText weight="regular" style={styles.loginLink}>
            Already have an account? Log in
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
  signUpBtn: {
    marginTop: spacing.sm,
  },
  loginLink: {
    fontSize: 13,
    color: colors.sage,
    textAlign: "center",
  },
});
