//ootd creation page for uploading ootd. Sets the ootdStore so it can save on /home
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Button,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import useOOTDStore from "../../services/stores/ootdStore";
import ColourPicker from "../components/ColourPicker";

const EditOOTD = () => {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [style, setStyle] = useState("");
  const [colourScheme, setColourScheme] = useState(
    /** @type {string[]} */ ([]),
  );
  const { imageUrl } = useLocalSearchParams();

  //ootdStore initialization
  const setOotd = useOOTDStore((state) => state.setOotd);

  //routing back home
  const handleBack = () => {
    router.back();
  };

  //saves caption and imageUrl to OotdStore and routes back to home
  const handlePost = () => {
    setOotd("caption", caption);
    setOotd("imageUrl", imageUrl);
    setOotd("style", style);
    setOotd("colourScheme", colourScheme);
    setOotd("saveFlag", true);
    router.replace("/(tabs)");
  };

  return (
    <ScrollView style={styles.view}>
      <FontAwesome5
        name="arrow-left"
        size={24}
        color="black"
        onPress={handleBack}
      ></FontAwesome5>
      <Image style={styles.image} source={{ uri: imageUrl }}></Image>
      <Text>Caption</Text>
      <TextInput
        style={styles.textBox}
        value={caption}
        onChangeText={setCaption}
      ></TextInput>
      <Text>Style</Text>
      <TextInput
        style={styles.textBox}
        value={style}
        onChangeText={setStyle}
      ></TextInput>

      <Text>Colour</Text>
      <ColourPicker selected={colourScheme} onChange={setColourScheme} />
      <Button style={styles.postBtn} onPress={handlePost} title="Post"></Button>
    </ScrollView>
  );
};

export default EditOOTD;

const styles = StyleSheet.create({
  view: {
    marginTop: 50,
    marginBottom: 50,
  },
  image: {
    width: "100%",
    height: 500,
    resizeMode: "contain",
  },
  textBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 6,
    marginHorizontal: 12,
  },
});
