import React, { useRef } from "react";
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import useWeeklyStrip from "../hooks/useFetchWeek";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import { colors, spacing, radius } from "../../constants/theme";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const SLOT_WIDTH = Dimensions.get("window").width * 0.72;
const SLOT_HEIGHT = 480;
const CAPTURE_SLOT_WIDTH = 160; // fixed width per slot for the capture view
const CAPTURE_HEIGHT = 280;
const TODAY_INDEX = new Date().getDay();

const WeeklyStrip = () => {
  const { weekStrip, loading } = useWeeklyStrip();
  const listRef = useRef(null);
  const captureRef = useRef(null);

  const handleSave = async () => {
    try {
      //const { granted } = await MediaLibrary.requestPermissionsAsync();
      /*if (!granted) {
        Alert.alert(
          "Permission required",
          "Allow access to save to camera roll.",
        );
        return;
      }*/
      const uri = await captureRef.current.capture();
      console.log("Capture URI:", uri);
      Alert.alert("Success", `Strip captured at: ${uri}`);
      //await MediaLibrary.saveToLibraryAsync(uri);
      /*Alert.alert(
        "Saved",
        "Your weekly strip has been saved to your camera roll.",
      );*/
    } catch (error) {
      console.error("Failed to save strip:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <AppText weight="regular" style={styles.loadingText}>
          Loading your week...
        </AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <AppText weight="bold" style={styles.headerTitle}>
          This week
        </AppText>
      </View>

      {/* ── Scrollable strip (visible to user) ── */}
      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={weekStrip}
          keyExtractor={(_, index) => DAY_LABELS[index]}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          getItemLayout={(_, index) => ({
            length: SLOT_WIDTH + spacing.sm,
            offset: (SLOT_WIDTH + spacing.sm) * index,
            index,
          })}
          initialScrollIndex={TODAY_INDEX}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              listRef.current?.scrollToIndex({
                index: info.index,
                animated: false,
                viewPosition: 0.5,
              });
            }, 100);
          }}
          renderItem={({ item: ootd, index }) => {
            const isToday = index === TODAY_INDEX;
            return (
              <View style={[styles.slot, { width: SLOT_WIDTH }]}>
                {ootd ? (
                  <Image
                    source={{ uri: ootd.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.empty}>
                    <AppText weight="regular" style={styles.emptyText}>
                      No post
                    </AppText>
                  </View>
                )}
                <View style={styles.labelPill}>
                  <AppText
                    weight="medium"
                    style={[styles.label, isToday && styles.labelToday]}
                  >
                    {DAY_LABELS[index]}
                  </AppText>
                  {isToday && <View style={styles.todayDot} />}
                </View>
              </View>
            );
          }}
        />
      </View>

      {/* ── Hidden capture view (off-screen, full width) ── */}
      <View style={styles.offscreen}>
        <ViewShot
          ref={captureRef}
          options={{ format: "jpg", quality: 1.0 }}
          style={styles.captureStrip}
        >
          {weekStrip.map((ootd, index) => {
            const isToday = index === TODAY_INDEX;
            return (
              <View
                key={DAY_LABELS[index]}
                style={[styles.captureSlot, { width: CAPTURE_SLOT_WIDTH }]}
              >
                {ootd ? (
                  <Image
                    source={{ uri: ootd.imageUrl }}
                    style={styles.captureImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.captureEmpty} />
                )}
                <View style={styles.labelPill}>
                  <AppText
                    weight="medium"
                    style={[styles.label, isToday && styles.labelToday]}
                  >
                    {DAY_LABELS[index]}
                  </AppText>
                  {isToday && <View style={styles.todayDot} />}
                </View>
              </View>
            );
          })}
        </ViewShot>
      </View>

      {/* ── Save button ── */}
      <View style={styles.footer}>
        <AppButton
          title="Save strip"
          onPress={handleSave}
          style={styles.saveBtn}
        />
      </View>
    </SafeAreaView>
  );
};

export default WeeklyStrip;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    color: colors.ink,
  },
  container: {
    height: SLOT_HEIGHT,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.paper,
  },
  loadingText: {
    fontSize: 13,
    color: colors.textMuted,
    letterSpacing: 1,
  },

  // ── Scrollable strip ──
  slot: {
    height: SLOT_HEIGHT,
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  empty: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  emptyText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  labelPill: {
    position: "absolute",
    bottom: spacing.sm,
    left: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(43, 42, 40, 0.5)",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.paper,
    opacity: 0.7,
  },
  labelToday: {
    opacity: 1,
    color: colors.sage,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.sage,
  },

  // ── Hidden capture view ──
  offscreen: {
    position: "absolute",
    top: -9999,
    left: -9999,
  },
  captureStrip: {
    flexDirection: "row",
    height: CAPTURE_HEIGHT,
    backgroundColor: colors.paper,
  },
  captureSlot: {
    height: CAPTURE_HEIGHT,
    position: "relative",
  },
  captureImage: {
    width: "100%",
    height: "100%",
  },
  captureEmpty: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.surface,
  },

  // ── Save button ──
  footer: {
    padding: spacing.lg,
  },
  saveBtn: {
    width: "100%",
  },
});
