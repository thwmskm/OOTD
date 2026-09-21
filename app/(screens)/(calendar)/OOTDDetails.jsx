import { StyleSheet, View, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { getOOTD } from "../../../services/ootdService";
import { interpretWeatherCode } from "../../../services/weatherService";
import AppText from "../../components/AppText";
import { colors, spacing, radius } from "../../../constants/theme";

//displays the selected date's ootd
const OOTDDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  //useStates for the ootd details
  const [saves, setSaves] = useState(undefined);
  const [caption, setCaption] = useState(undefined);
  const [weather, setWeather] = useState(undefined);
  const [temp, setTemp] = useState(undefined);
  const [image, setImage] = useState(null);
  const [date, setDate] = useState("");

  //fetch ootd details
  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        const snap = await getOOTD(id);
        if (snap) {
          setSaves(snap.saves);
          setCaption(snap.caption);
          setImage(snap.imageUrl);
          setDate(snap.date);
          if (snap.weather) {
            setWeather(snap.weather.weatherCode);
            setTemp(snap.weather.temp);
          }
        }
      } catch (error) {
        console.log("Error fetching details", error);
      } finally {
        setLoading(true);
      }
    };
    fetchDetails();
  }, [id]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.ink} />
        </Pressable>
        <AppText weight="bold" style={styles.headerTitle}>
          OOTD
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.body}>
          <View style={styles.imageArea}>
            <Image source={{ uri: image }} style={styles.ootdImage}></Image>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.savesRow}>
              <FontAwesome5 name="bookmark" size={14} color={colors.ink} />
              <AppText weight="medium" style={styles.savesText}>
                {saves ?? 0}
              </AppText>
            </View>
            {weather !== undefined && (
              <AppText weight="regular" style={styles.weatherText}>
                {temp}°C · {interpretWeatherCode(weather).emoji}{" "}
                {interpretWeatherCode(weather).label}
              </AppText>
            )}
          </View>

          {caption ? (
            <View style={styles.captionArea}>
              <AppText weight="regular" style={styles.captionText}>
                {caption}
              </AppText>
            </View>
          ) : null}

          <AppText weight="regular" style={styles.dateText}>
            Posted {date}
          </AppText>
        </View>
      ) : (
        <View style={styles.loadingBody}>
          <AppText weight="medium" style={styles.loadingText}>
            Loading...
          </AppText>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OOTDDetails;

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
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  imageArea: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  ootdImage: {
    width: 300,
    height: 400,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  savesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  savesText: {
    fontSize: 14,
    color: colors.ink,
  },
  weatherText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  captionArea: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  captionText: {
    fontSize: 15,
    color: colors.ink,
    lineHeight: 21,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  loadingBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
