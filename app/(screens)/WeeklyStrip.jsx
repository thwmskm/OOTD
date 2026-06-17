import React, { useRef } from "react";
import {
  View,
  Image,
  FlatList,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import useWeeklyStrip from "../hooks/useFetchWeek";

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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>—</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* ── Scrollable strip (visible to user) ── */}
      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={weekStrip}
          keyExtractor={(_, index) => DAY_LABELS[index]}
          horizontal
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: SLOT_WIDTH,
            offset: SLOT_WIDTH * index,
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
                  <View style={styles.empty} />
                )}
                <View style={styles.labelContainer}>
                  <Text style={[styles.label, isToday && styles.labelToday]}>
                    {DAY_LABELS[index]}
                  </Text>
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
                <View style={styles.labelContainer}>
                  <Text style={[styles.label, isToday && styles.labelToday]}>
                    {DAY_LABELS[index]}
                  </Text>
                  {isToday && <View style={styles.todayDot} />}
                </View>
              </View>
            );
          })}
        </ViewShot>
      </View>

      {/* ── Save button ── */}
      <Pressable style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>SAVE STRIP</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default WeeklyStrip;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    height: SLOT_HEIGHT,
  },
  loadingContainer: {
    height: SLOT_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0e0e0e",
  },
  loadingText: {
    color: "#f0ece4",
    fontFamily: "SpaceGrotesk",
    letterSpacing: 4,
  },

  // ── Scrollable strip ──
  slot: {
    height: SLOT_HEIGHT,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  empty: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0e0e0e",
  },
  labelContainer: {
    position: "absolute",
    bottom: 12,
    left: 10,
    alignItems: "flex-start",
    gap: 4,
  },
  label: {
    color: "#f0ece4",
    fontSize: 10,
    fontFamily: "SpaceGrotesk",
    letterSpacing: 2,
    opacity: 0.5,
  },
  labelToday: {
    opacity: 1,
    color: "#C8F135",
  },
  todayDot: {
    width: 4,
    height: 4,
    backgroundColor: "#C8F135",
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
    backgroundColor: "#0e0e0e",
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
    backgroundColor: "#0e0e0e",
  },

  // ── Save button ──
  saveBtn: {
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  saveBtnText: {
    fontFamily: "SpaceGrotesk",
    fontSize: 11,
    letterSpacing: 3,
  },
});
