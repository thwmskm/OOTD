import { StyleSheet, View, Image, Pressable, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import useUserStore from "../../services/stores/userStore";
import { useImagePicker } from "../hooks/useImagePicker";
import PfpCropper from "../components/PfpCropper";
import { storePfp } from "../../services/Storage";
import { updateUser } from "../../services/userService";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import { colors, spacing, radius } from "../../constants/theme";

const EditProfile = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [rawUri, setRawUri] = useState(null); // freshly picked, awaiting crop
  const [saving, setSaving] = useState(false);

  //handle changing pfp
  const { pickImage } = useImagePicker();
  const handlePickImage = () => {
    pickImage((uri) => setRawUri(uri));
  };

  //After crop is confirmed: upload to storage, persist to Firestore, sync store
  const handleCropComplete = async (croppedUri) => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      const downloadUrl = await storePfp(croppedUri, user.uid);
      await updateUser(user.uid, { pfp: downloadUrl });
      setUser("pfp", downloadUrl);
    } catch (error) {
      console.error("Error while saving new pfp", error);
    } finally {
      setSaving(false);
      setRawUri(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.ink} />
        </Pressable>
        <AppText weight="bold" style={styles.headerTitle}>
          Edit Profile
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.topSect}>
        {user.pfp ? (
          <Image style={styles.pfp} source={{ uri: user.pfp }}></Image>
        ) : (
          <View style={styles.emptyPfp}>
            <FontAwesome5 name="user" size={28} color={colors.textMuted} />
          </View>
        )}
        <AppButton
          title={saving ? "Saving..." : "Change Picture"}
          onPress={handlePickImage}
          disabled={saving}
          variant="primary"
          style={styles.changeButton}
        />
      </View>

      <View style={styles.bottomSect}>
        <AppText weight="medium" style={styles.label}>
          Username
        </AppText>
        <Pressable
          style={styles.usernameRow}
          onPress={() => router.push("/ChangeUsername")}
        >
          <AppText weight="regular" style={styles.username}>
            {user.username}
          </AppText>
          <FontAwesome5
            name="chevron-right"
            size={14}
            color={colors.textMuted}
          />
        </Pressable>
      </View>

      <Modal visible={!!rawUri} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {rawUri && (
            <PfpCropper
              imageUri={rawUri}
              onCancel={() => setRawUri(null)}
              onCropComplete={handleCropComplete}
              saving={saving}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EditProfile;

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
  topSect: {
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  pfp: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  emptyPfp: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  changeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  bottomSect: {
    paddingHorizontal: spacing.lg,
  },
  label: {
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  username: {
    fontSize: 16,
    color: colors.ink,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
  },
});
