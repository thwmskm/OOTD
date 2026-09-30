import { StyleSheet, View, Image, Pressable, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useImagePicker } from "../../hooks/useImagePicker";
import { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import { colors, spacing, radius } from "../../../constants/theme";

const Pfp = () => {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [uri, setUri] = useState("");

  const { pickImage } = useImagePicker();

  const handlePickPfp = () => {
    pickImage((newUri) => {
      setUri(newUri);
    });
  };

  const goToFinalize = () => {
    router.push({
      pathname: "/finalize-screen",
      params: { username: username, pfp: uri },
    });
  };

  const savePfp = () => {
    Alert.alert(
      "Continue with this photo?",
      "You can change your profile picture later.",
      [
        {
          text: "No",
          style: "cancel",
          onPress: handlePickPfp,
        },
        {
          text: "Yes",
          onPress: goToFinalize,
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={styles.backBtn}
      ></Pressable>
      <AppText weight="medium" style={styles.label}>
        Choose a picture to display on your profile
      </AppText>
      <Pressable onPress={handlePickPfp} style={styles.avatarCircle}>
        {uri ? (
          <Image source={{ uri: uri }} style={styles.avatarImage}></Image>
        ) : (
          <FontAwesome5 name="camera" size={22} color={colors.textMuted} />
        )}
      </Pressable>
      <AppButton
        title="to finalize"
        onPress={savePfp}
        variant="primary"
        disabled={!uri}
      />
      <Pressable onPress={goToFinalize}>
        <AppText weight="regular" style={styles.skipText}>
          Skip
        </AppText>
      </Pressable>
    </View>
  );
};

export default Pfp;

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
  label: {
    fontSize: 16,
    color: colors.ink,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  skipText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
