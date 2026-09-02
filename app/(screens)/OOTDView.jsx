//Ootd page for editing and viewing already posted ootd. Saves on the spot rather than routing home
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import useOOTDStore from "../../services/stores/ootdStore";
import useUserStore from "../../services/stores/userStore";
import { useRouter } from "expo-router";
import { updateOOTD, deleteOOTD, getOOTD } from "../../services/ootdService";
import { FontAwesome5 } from "@expo/vector-icons";
import useStreak from "../hooks/useStreak";
import ColourPicker, { COLOURS } from "../components/ColourPicker";
import {
  incrementTotalOOTDs,
  incrementStatCount,
  incrementStatCounts,
} from "../../services/userStatsService";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import { colors, spacing, radius } from "../../constants/theme";

const OOTDView = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const ootd = useOOTDStore((state) => state.ootd);
  const setOotd = useOOTDStore((state) => state.setOotd);
  const resetOotdStore = useOOTDStore((state) => state.resetOotdStore);

  const { deleteStreak } = useStreak();

  const [saves, setSaves] = useState(0);
  const [flag, setFlag] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(ootd.caption);
  const [style, setStyle] = useState(ootd.style);
  const [colourScheme, setColourScheme] = useState(ootd.colourScheme ?? []);
  const [createdAt, setCreatedAt] = useState("");

  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const dateLabel = now
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();

  useEffect(() => {
    if (!user) return;

    setCaption(ootd.caption);

    const fetchOotd = async () => {
      try {
        const id = `${user.uid}_${date}`;
        const fetched = await getOOTD(id);
        if (fetched) {
          setSaves(fetched.saves ?? 0);
          setCreatedAt(fetched.createdAt);
          setFlag(true);
        }
      } catch (error) {
        console.error("Error fetching ootd", error);
      }
    };

    fetchOotd();
  }, [user?.uid, date, ootd.caption]);

  const canEdit =
    createdAt && Date.now() - createdAt.toMillis() < 10 * 60 * 1000;

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleDelete = async () => {
    if (!user) return;

    Alert.alert(
      "Delete OOTD",
      "Are you sure you want to delete today's OOTD? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const id = `${user.uid}_${date}`;
              await deleteOOTD(id);

              await incrementTotalOOTDs(user.uid, -1);
              if (ootd.style) {
                await incrementStatCount(
                  user.uid,
                  "styleCounts",
                  ootd.style,
                  -1,
                );
              }
              const colourLabels = ootd.colourScheme ?? [];
              if (colourLabels.length) {
                await incrementStatCounts(
                  user.uid,
                  "colourCounts",
                  colourLabels,
                  -1,
                );
              }

              resetOotdStore();
              await deleteStreak();
              router.replace("/(tabs)");
            } catch (error) {
              console.error("Error deleting ootd:", error);
              Alert.alert(
                "Error",
                "Could not delete OOTD. The 10 minute window may have passed.",
              );
            }
          },
        },
      ],
    );
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const id = `${user.uid}_${date}`;
      await updateOOTD(id, { caption, style, colourScheme });

      if (ootd.style !== style) {
        if (ootd.style) {
          await incrementStatCount(user.uid, "styleCounts", ootd.style, -1);
        }
        if (style) {
          await incrementStatCount(user.uid, "styleCounts", style, 1);
        }
      }

      const oldColours = ootd.colourScheme ?? [];
      const newColours = colourScheme ?? [];
      const removed = oldColours.filter((c) => !newColours.includes(c));
      const added = newColours.filter((c) => !oldColours.includes(c));

      if (removed.length) {
        await incrementStatCounts(user.uid, "colourCounts", removed, -1);
      }
      if (added.length) {
        await incrementStatCounts(user.uid, "colourCounts", added, 1);
      }

      setOotd("caption", caption);
      setOotd("style", style);
      setOotd("colourScheme", colourScheme);
      toggleEdit();
    } catch (error) {
      console.error("Error while updating ootd", error);
      throw error;
    }
  };

  const Header = ({ title }) => (
    <View style={styles.header}>
      <Pressable
        onPress={() => (isEditing ? toggleEdit() : router.back())}
        hitSlop={12}
      >
        <FontAwesome5 name="arrow-left" size={18} color={colors.ink} />
      </Pressable>
      <AppText weight="medium" style={styles.headerTitle}>
        {title}
      </AppText>
      {!isEditing && canEdit ? (
        <View style={styles.headerActions}>
          <Pressable onPress={toggleEdit} hitSlop={10}>
            <FontAwesome5 name="pencil-alt" size={15} color={colors.ink} />
          </Pressable>
          <Pressable onPress={handleDelete} hitSlop={10}>
            <FontAwesome5 name="trash" size={15} color={colors.textMuted} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.headerSpacer} />
      )}
    </View>
  );

  if (isEditing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <Header title="EDITING" />
        <ScrollView contentContainerStyle={styles.editBody}>
          <View style={styles.frame}>
            <Image
              source={{ uri: ootd.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.fieldGroup}>
            <AppText weight="medium" style={styles.fieldLabel}>
              Caption
            </AppText>
            <TextInput
              onChangeText={setCaption}
              value={caption}
              placeholder="Say something about today's fit"
              placeholderTextColor={colors.textMuted}
              style={styles.textInput}
              multiline
            />
          </View>

          <View style={styles.fieldGroup}>
            <AppText weight="medium" style={styles.fieldLabel}>
              Style
            </AppText>
            <TextInput
              onChangeText={setStyle}
              value={style}
              placeholder="e.g. Streetwear, Minimal, Y2K"
              placeholderTextColor={colors.textMuted}
              style={styles.textInput}
            />
          </View>

          <View style={styles.fieldGroup}>
            <AppText weight="medium" style={styles.fieldLabel}>
              Colours
            </AppText>
            <ColourPicker selected={colourScheme} onChange={setColourScheme} />
          </View>

          <AppButton
            title="Save changes"
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Header title={dateLabel} />

      <View style={styles.frame}>
        <Image
          source={{ uri: ootd.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {flag ? (
          <View style={styles.savesOverlay}>
            <FontAwesome5
              name="bookmark"
              size={12}
              color={colors.paper}
              solid
            />
            <AppText weight="medium" style={styles.savesText}>
              {saves}
            </AppText>
          </View>
        ) : null}

        {ootd.caption ? (
          <View style={styles.bottomScrim}>
            <AppText weight="regular" style={styles.captionText}>
              {ootd.caption}
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.detailPanel}>
        <View style={styles.tagRow}>
          {ootd.style ? (
            <View style={styles.tag}>
              <AppText weight="medium" style={styles.tagText}>
                {ootd.style}
              </AppText>
            </View>
          ) : null}

          {(ootd.colourScheme ?? []).map((label) => {
            const hex =
              COLOURS.find((c) => c.label === label)?.hex ?? colors.line;
            return (
              <View key={label} style={styles.tag}>
                <View style={[styles.tagSwatch, { backgroundColor: hex }]} />
                <AppText weight="medium" style={styles.tagText}>
                  {label}
                </AppText>
              </View>
            );
          })}
        </View>

        {!canEdit ? (
          <AppText weight="regular" style={styles.lockedNote}>
            Editing window has closed for today's post
          </AppText>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default OOTDView;

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
  headerActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  headerSpacer: {
    width: 18,
  },
  frame: {
    width: "95%",
    alignSelf: "center",
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.surface,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  savesOverlay: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(43, 42, 40, 0.55)",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  savesText: {
    fontSize: 12,
    color: colors.paper,
  },
  bottomScrim: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: "rgba(43, 42, 40, 0.35)",
  },
  captionText: {
    fontSize: 14,
    color: colors.paper,
    textAlign: "left",
  },
  detailPanel: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  tagSwatch: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tagText: {
    fontSize: 12,
    color: colors.ink,
    textTransform: "capitalize",
  },
  lockedNote: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: "italic",
  },
  editBody: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
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
  saveBtn: {
    marginTop: spacing.sm,
  },
});
