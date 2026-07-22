import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Button,
  Pressable,
} from "react-native";
import React, { useCallback } from "react";
import { useImagePicker } from "../hooks/useImagePicker";
import { useFocusEffect, useRouter } from "expo-router";
import { storeOOTD } from "../../services/Storage";
import useOOTDStore from "../../services/stores/ootdStore";
import { createOOTD } from "../../services/ootdService";
import { getOOTD } from "../../services/ootdService";
import useStreak from "../hooks/useStreak";
import useUserStore from "../../services/stores/userStore";
import { FontAwesome5 } from "@expo/vector-icons";
import useWeather from "../hooks/useWeather";
import { interpretWeatherCode } from "../../services/weatherService";
import {
  incrementTotalOOTDs,
  incrementStatCounts,
  incrementStatCount,
} from "../../services/userStatsService";

//Opening screen on launch
const Home = () => {
  const router = useRouter();

  //create date of upload (YYY-MM-DD)
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  //userStore initialization
  const user = useUserStore((state) => state.user);

  //initialize useStreak hook
  const { updateStreak } = useStreak(user?.uid ?? "");

  //ootdStore initialization
  const ootd = useOOTDStore((state) => state.ootd);
  const setOotd = useOOTDStore((state) => state.setOotd);
  const resetOotdStore = useOOTDStore((state) => state.resetOotdStore);

  //weather api
  const { forecast, isLoading } = useWeather();
  const current = forecast?.current;
  const { emoji, label } = current
    ? interpretWeatherCode(current.weatherCode)
    : { emoji: "—", label: "" };

  //trigger saveOOTD on remount if ootdStore saveFlag is true (only on initial save from EdtiOOTD)
  useFocusEffect(
    useCallback(() => {
      if (ootd.saveFlag) {
        saveOOTD(ootd.imageUrl);
      }
    }, [ootd.saveFlag]),
  );

  //checks and updates streak based on upload
  async function handleStreak() {
    if (!user?.uid || !user?.email) {
      return;
    }
    await updateStreak();
  }

  //handle logic for when user taps on the ootd post
  function handleOOTDView() {
    router.push("/OOTDView");
  }

  //save ootd to storage and db on imageUpload complete
  async function saveOOTD(url) {
    if (!user) return;

    //generate new ootd id (user id_date)
    const newId = `${user.uid}_${date}`;

    //obtain downaloadUrl and store image in firebase storage
    const downloadUrl = await storeOOTD(url, newId, user.uid);
    console.log("OOTD uploaded");

    //Create new ootd instance
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
    console.log(newOOTD);

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
      console.log("OOTD created");
      setOotd("saveFlag", false);
      //update user streak
      await handleStreak();
    } catch (error) {
      console.error("Error trying to create ootd", error);
      throw error;
    }
  }

  //handling ootd upload
  const { pickImage } = useImagePicker();
  const handlePickImage = () => {
    pickImage((uri) => {
      router.push({
        pathname: "/EditOOTD",
        params: {
          imageUrl: uri,
        },
      });
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text>YU*YL</Text>
        {!user ? <Text>--</Text> : <Text>{user.streak}</Text>}
        <Button
          title="week"
          onPress={() => {
            router.push("/WeeklyStrip");
          }}
        ></Button>
      </View>
      <View style={styles.body}>
        <Text>{date}</Text>
        <View>
          {isLoading ? (
            <Text>Loading weather...</Text>
          ) : forecast?.current ? (
            <View>
              <Text>
                {interpretWeatherCode(forecast.current.weatherCode).emoji}{" "}
                {forecast.current.temp}°C
              </Text>
            </View>
          ) : (
            <Text>Weather unavailable</Text>
          )}
        </View>
        <View>
          {!ootd.imageUrl ? (
            <Button
              title="Upload YUYL"
              onPress={handlePickImage}
              disabled={isLoading}
            ></Button>
          ) : (
            <View style={styles.postArea}>
              <Pressable onPress={handleOOTDView}>
                <Image
                  source={{ uri: ootd.imageUrl }}
                  style={styles.ootdImage}
                ></Image>
              </Pressable>
              <View>
                <Text>{ootd.caption}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  body: {
    margin: "auto",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: "15%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  ootdImage: {
    width: 300,
    height: 400,
  },
});
