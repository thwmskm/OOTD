//ootd creation page for uploading ootd. Sets the ootdStore so it can save on /home
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import useOOTDStore from "../../services/stores/ootdStore";
import ColourPicker from "../components/ColourPicker";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import { colors, spacing, radius } from "../../constants/theme";

const EditOOTD = () => {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [style, setStyle] = useState("");
  const [colourScheme, setColourScheme] = useState(
    /** @type {string[]} */ ([]),
  );
  const [isPosting, setIsPosting] = useState(false);
  const { imageUrl } = useLocalSearchParams();

  const setOotd = useOOTDStore((state) => state.setOotd);

  const handleBack = () => {
    router.back();
  };

  const handlePost = () => {
    if (isPosting) return;
    setIsPosting(true);

    setOotd("caption", caption);
    setOotd("imageUrl", imageUrl);
    setOotd("style", style);
    setOotd("colourScheme", colourScheme);
    setOotd("saveFlag", true);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12}>
          <FontAwesome5 name="arrow-left" size={18} color={colors.ink} />
        </Pressable>
        <AppText weight="medium" style={styles.headerTitle}>
          New post
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.frame}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.fieldGroup}>
          <AppText weight="medium" style={styles.fieldLabel}>
            Caption
          </AppText>
          <TextInput
            style={styles.textInput}
            value={caption}
            onChangeText={setCaption}
            placeholder="Say something about today's fit"
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>

        <View style={styles.fieldGroup}>
          <AppText weight="medium" style={styles.fieldLabel}>
            Style
          </AppText>
          <TextInput
            style={styles.textInput}
            value={style}
            onChangeText={setStyle}
            placeholder="e.g. Streetwear, Minimal, Y2K"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.fieldGroup}>
          <AppText weight="medium" style={styles.fieldLabel}>
            Colours
          </AppText>
          <ColourPicker selected={colourScheme} onChange={setColourScheme} />
        </View>

        <AppButton
          title={isPosting ? "Posting..." : "Post"}
          onPress={handlePost}
          disabled={isPosting}
          style={styles.postBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditOOTD;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  headerSpacer: {
    width: 18,
  },
  body: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  frame: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  image: {
    width: "100%",
    height: "100%",
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
  postBtn: {
    marginTop: spacing.sm,
  },
});
