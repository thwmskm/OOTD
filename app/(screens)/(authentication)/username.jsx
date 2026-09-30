import { Text, StyleSheet, View, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";
import { colors, spacing, radius } from "../../../constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";

const Username = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [hasError, setHasError] = useState(false);

  const saveUsername = () => {
    if (!username.trim()) {
      setHasError(true);
      return;
    }
    setHasError(false);
    console.log("username page: ", username);
    router.push({
      pathname: "/pfp",
      params: { username: username.trim() },
    });
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
      <Text style={styles.label}>Type your Display Name</Text>
      <TextInput
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          if (hasError) setHasError(false);
        }}
        placeholder="Enter display name."
        style={[styles.input, hasError && styles.inputError]}
      ></TextInput>
      {hasError && (
        <AppText weight="regular" style={styles.errorText}>
          Please enter a username before moving on.
        </AppText>
      )}
      <AppButton title="to pfp" onPress={saveUsername} variant="primary" />
    </View>
  );
};

export default Username;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.paper,
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  inputError: {
    borderColor: colors.blush,
  },
  errorText: {
    fontSize: 12,
    color: colors.blush,
    marginBottom: spacing.sm,
  },
});
