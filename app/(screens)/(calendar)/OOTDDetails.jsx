import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Button,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getOOTD } from "../../../services/ootdService";
import { interpretWeatherCode } from "../../../services/weatherService";

//displays the selected date's ootd
const OOTDDetails = () => {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  //useStates for the ootd details
  const [likes, setLikes] = useState(undefined);
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
          setLikes(snap.likes);
          setSaves(snap.saves);
          setCaption(snap.caption);
          setImage(snap.imageUrl);
          setDate(snap.date);
          setWeather(interpretWeatherCode(snap.weather.current.weatherCode));
          setTemp(snap.weather.current.temp);
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
    <>
      {loading ? (
        <>
          <View style={styles.imageArea}>
            <Image source={{ uri: image }} style={styles.ootdImage}></Image>
          </View>

          <View>
            <Text>Likes: {likes}</Text>
            <Text>Saves: {saves}</Text>
            <Text>
              {temp}°C - {weather}
            </Text>
          </View>

          <View style={styles.captionArea}>
            <Text>{caption}</Text>
          </View>
          <Text>Posted {date}</Text>
        </>
      ) : (
        <>
          <Text>Loading...</Text>
        </>
      )}
    </>
  );
};

export default OOTDDetails;

const styles = StyleSheet.create({
  captionArea: {
    borderWidth: 1,
    borderColor: "black",
  },
  imageArea: {
    alignItems: "center",
  },
  ootdImage: {
    width: 300,
    height: 400,
  },
});
