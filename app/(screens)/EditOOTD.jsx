import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Button,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import useOOTDStore from "../../services/stores/ootdStore";

const EditOOTD = () => {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const { imageUrl } = useLocalSearchParams();

  //ootdStore initialization
  const ootd = useOOTDStore((state) => state.ootd);
  const loadOotd = useOOTDStore((state) => state.loadOotd);
  const setOotd = useOOTDStore((state) => state.setOotd);
  const resetOotdStore = useOOTDStore((state) => state.resetOotdStore);

  //routing back home
  const handleBack = () => {
    router.back();
  };

  //saves caption and imageUrl to OotdStore and routes back to home
  const handlePost = () => {
    setOotd("caption", caption);
    setOotd("imageUrl", imageUrl);
    router.replace("/(tabs)");
  };

  return (
    <View>
      <FontAwesome5
        name="arrow-left"
        size={24}
        color="black"
        onPress={handleBack}
      ></FontAwesome5>
      <Image style={styles.image} source={{ uri: imageUrl }}></Image>
      <TextInput
        style={styles.textBox}
        value={caption}
        onChangeText={setCaption}
      ></TextInput>
      <Button style={styles.postBtn} onPress={handlePost} title="Post"></Button>
    </View>
  );
};

export default EditOOTD;

const styles = StyleSheet.create({});
