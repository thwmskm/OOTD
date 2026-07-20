import { Text, StyleSheet, View, Button, Image, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useImagePicker } from "../../hooks/useImagePicker";
import PfpCropper from "../../components/PfpCropper";
import { useState } from "react";

const Pfp = () => {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [rawUri, setRawUri] = useState(null); // freshly picked, uncropped
  const [croppedUri, setCroppedUri] = useState(null);

  const { pickImage } = useImagePicker();

  const handlePick = () => {
    pickImage((uri) => setRawUri(uri));
  };

  const savePfp = () => {
    router.push({
      pathname: "/finalize-screen",
      params: { username: username, pfp: croppedUri },
    });
  };

  return (
    <View>
      <Text>Choose a picture to display on your profile</Text>

      {rawUri && !croppedUri ? (
        <PfpCropper
          imageUri={rawUri}
          onCancel={() => setRawUri(null)}
          onCropComplete={(uri) => setCroppedUri(uri)}
        />
      ) : (
        <>
          {croppedUri && (
            <Image source={{ uri: croppedUri }} style={styles.preview} />
          )}
          <Button
            title={croppedUri ? "Retake" : "Pick photo"}
            onPress={handlePick}
          />
        </>
      )}

      <Button title="to finalize" onPress={savePfp} disabled={!croppedUri} />
      <Pressable onPress={savePfp}>
        <Text>Skip</Text>
      </Pressable>
    </View>
  );
};

export default Pfp;

const styles = StyleSheet.create({
  preview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginVertical: 10,
  },
});
