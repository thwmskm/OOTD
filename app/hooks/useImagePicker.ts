// hooks/useImagePicker.ts
// hook to solely pick images from local device and deliver uri to appropriate screen based on ImageType
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export function useImagePicker() {
  const pickFromLibrary = async (): Promise<string | null> => {
    const { granted } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!granted) {
      Alert.alert("Permission required");
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.length) {
      return result.assets[0].uri;
    }

    return null;
  };

  const openCamera = async (): Promise<string | null> => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      Alert.alert("Permission required");
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.length) {
      return result.assets[0].uri;
    }

    return null;
  };

  const pickImage = (onPick: (uri: string) => void) => {
    Alert.alert(
      "Select Image",
      "Choose an image source",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const uri = await openCamera();
            if (uri) onPick(uri);
          },
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            const uri = await pickFromLibrary();
            if (uri) onPick(uri);
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  return { pickImage };
}

