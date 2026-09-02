import { StyleSheet, View, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback } from "react";
import { useImagePicker } from "../hooks/useImagePicker";
import { useFocusEffect, useRouter } from "expo-router";
import { storeOOTD } from "../../services/Storage";
import useOOTDStore from "../../services/stores/ootdStore";
import { createOOTD } from "../../services/ootdService";
import useStreak from "../hooks/useStreak";
import useUserStore from "../../services/stores/userStore";
import useWeather from "../hooks/useWeather";
import { interpretWeatherCode } from "../../services/weatherService";
import {
  incrementTotalOOTDs,
  incrementStatCounts,
  incrementStatCount,
} from "../../services/userStatsService";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import { colors, spacing, radius } from "../../constants/theme";

const Home = () => {
  const router = useRouter();

  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const dateLabel = now
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();

  //userStore initialization
  const user = useUserStore((state) => state.user);
  const { updateStreak } = useStreak();

  //ootdStore initialization
  const ootd = useOOTDStore((state) => state.ootd);
  const setOotd = useOOTDStore((state) => state.setOotd);

  //weather api
  const { forecast, isLoading } = useWeather();
  const current = forecast?.current;
  const { emoji } = current
    ? interpretWeatherCode(current.weatherCode)
    : { emoji: "—" };

  //trigger saveOOTD on remount if ootdStore saveFlag is true (only on initial save from EditOOTD)
  useFocusEffect(
    useCallback(() => {
      if (ootd.saveFlag) {
        saveOOTD(ootd.imageUrl).catch((error) => {
          console.error("Failed to sync OOTD on focus:", error);
        });
      }
    }, [ootd.saveFlag]),
  );

  async function handleStreak() {
    if (!user?.uid || !user?.email) return;
    await updateStreak();
  }

  function handleOOTDView() {
    router.push("/OOTDView");
  }

  async function saveOOTD(url) {
    if (!user) return;

    const newId = `${user.uid}_${date}`;
    const downloadUrl = await storeOOTD(url, newId, user.uid);

    const newOOTD = {
      id: newId,
      uid: user.uid,
      imageUrl: downloadUrl,
      date: date,
      oid: "",
      saves: 0,
      weather: current,
      colourScheme: ootd.colourScheme,
      style: ootd.style,
      caption: ootd.caption,
      createdAt: new Date(),
    };

    try {
      await createOOTD(newOOTD);
      setOotd("imageUrl", downloadUrl);

      if (ootd.style) {
        await incrementStatCount(user.uid, "styleCounts", ootd.style);
      }
      const colourLabels = ootd.colourScheme ?? [];
      if (colourLabels.length) {
        await incrementStatCounts(user.uid, "colourCounts", colourLabels);
      }
      await incrementTotalOOTDs(user.uid);

      setOotd("saveFlag", false);
      await handleStreak();
    } catch (error) {
      console.error("Error trying to create ootd", error);
      throw error;
    }
  }

  const { pickImage } = useImagePicker();
  const handlePickImage = () => {
    pickImage((uri) => {
      router.push({
        pathname: "/EditOOTD",
        params: { imageUrl: uri },
      });
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AppText weight="bold" style={styles.logo}>
            YU
            <AppText weight="bold" style={styles.logoAccent}>
              *
            </AppText>
            YL
          </AppText>
        </View>

        <View style={styles.headerRight}>
          <Pressable onPress={() => router.push("/WeeklyStrip")}>
            <AppText weight="medium" style={styles.weekLink}>
              Week
            </AppText>
          </Pressable>
        </View>

        <View style={styles.streakWrap} pointerEvents="none">
          <AppText weight="medium" style={styles.streakValue}>
            {user?.streak ?? "--"}
          </AppText>
        </View>
      </View>

      <View style={styles.body}>
        {!ootd.imageUrl ? (
          <View style={styles.emptyState}>
            <AppText style={styles.emptyText}>
              {isLoading
                ? "Checking today's weather..."
                : current
                  ? `${emoji}  ${current.temp}°C right now`
                  : "No post yet today"}
            </AppText>
            <AppButton
              title="Document today's fit"
              onPress={handlePickImage}
              disabled={isLoading}
              style={styles.uploadBtn}
            />
          </View>
        ) : (
          <Pressable onPress={handleOOTDView} style={styles.frame}>
            <Image
              source={{ uri: ootd.imageUrl }}
              style={styles.ootdImage}
              resizeMode="fill"
            />

            {/* top overlay: date + weather */}
            <View style={styles.topOverlayRow}>
              <View style={styles.pill}>
                <AppText weight="medium" style={styles.pillText}>
                  {dateLabel}
                </AppText>
              </View>
              <View style={styles.pill}>
                <AppText weight="medium" style={styles.pillText}>
                  {isLoading ? "—" : `${emoji} ${current?.temp ?? "--"}°`}
                </AppText>
              </View>
            </View>

            {/* bottom overlay: caption */}
            {ootd.caption ? (
              <View style={styles.bottomScrim}>
                <AppText weight="regular" style={styles.captionText}>
                  {ootd.caption}
                </AppText>
              </View>
            ) : null}
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;

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
    position: "relative",
  },
  headerLeft: {
    alignItems: "flex-start",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  streakWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  streakValue: {
    fontSize: 13,
    color: colors.ink,
  },
  logo: {
    fontSize: 18,
    color: colors.ink,
    letterSpacing: 0.5,
  },
  logoAccent: {
    fontSize: 18,
    color: colors.sage,
  },
  weekLink: {
    fontSize: 13,
    color: colors.textMuted,
  },
  body: {
    flex: 1,
    alignItems: "center",
  },
  frame: {
    flex: 1,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    overflow: "hidden",
    width: "95%",
    backgroundColor: colors.surface,
    position: "relative",
  },
  ootdImage: {
    width: "100%",
    height: "100%",
  },
  topOverlayRow: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pill: {
    backgroundColor: "rgba(43, 42, 40, 0.55)", // ink at low opacity — works over any photo
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  pillText: {
    fontSize: 12,
    color: colors.paper,
    letterSpacing: 0.5,
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  uploadBtn: {
    minWidth: 220,
  },
});
