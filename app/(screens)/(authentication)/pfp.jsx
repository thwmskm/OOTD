import { Text, StyleSheet, View, Button, Image, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useImagePicker } from "../../hooks/useImagePicker";
import { useState } from "react";

const Pfp = () => {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [uri, setUri] = useState("");

  const { pickImage } = useImagePicker();

  const handlePickPfp = () => {
    pickImage((newUri) => {
      setUri(newUri);
    });
  };

  const savePfp = () => {
    router.push({
      pathname: "/finalize-screen",
      params: { username: username, pfp: uri },
    });
  };

  return (
    <View>
      <Text>Choose a picture to display on your profile</Text>
      <Pressable onPress={handlePickPfp}>
        <Text>Choose Photo</Text>
      </Pressable>
      {uri ? (
        <Image
          source={{ uri: uri }}
          style={{ width: 100, height: 100 }}
        ></Image>
      ) : null}
      <Button title="to finalize" onPress={savePfp}>
        <Text>Ok</Text>
      </Button>
      <Pressable onPress={savePfp}>
        <Text>Skip</Text>
      </Pressable>
    </View>
  );
};

export default Pfp;

const styles = StyleSheet.create({});
