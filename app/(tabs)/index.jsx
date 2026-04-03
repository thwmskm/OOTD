import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Button,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useImagePicker } from "../hooks/useImagePicker";
import { useFocusEffect, useRouter } from "expo-router";
import uuid from "react-native-uuid";
import { storeOOTD } from "../../services/Storage";
import useOOTDStore from "../../services/stores/ootdStore";
import { FB_auth } from "../../database/firebase";
import { db } from "../../database/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { createOOTD } from "../../services/ootdService";

//Opening screen on launch
const Home = () => {
  const [imageUri, setImageUri] = useState(null);
  const router = useRouter();
  const user = FB_auth.currentUser;

  //ootdStore initialization
  const ootd = useOOTDStore((state) => state.ootd);
  const resetOotdStore = useOOTDStore((state) => state.resetOotdStore);

  //trigger saveOOTD on remount if ootdStore attributes are populated
  useFocusEffect(
    useCallback(() => {
      if (ootd.imageUrl && ootd.caption) {
        saveOOTD(ootd.imageUrl);
      }
    }, [ootd.imageUrl, ootd.caption]),
  );

  //save ootd to storage and db on imageUpload complete
  async function saveOOTD(url) {
    if (!user) return;

    //generate new ootd id
    const newId = uuid.v4().toString();

    //obtain downaloadUrl and store image in firebase storage
    const downloadUrl = await storeOOTD(url, newId, user.uid);
    console.log("OOTD uploaded");

    //create date of upload (YYY-MM-DD)
    const date = new Date().toISOString().split("T")[0];

    //Create new ootd instance
    const newOOTD = {
      id: newId,
      uid: user.uid,
      imageUrl: downloadUrl,
      date: date,
      oid: "",
      caption: ootd.caption,
      createdAt: new Date(),
    };
    console.log(newOOTD);

    try {
      await createOOTD(newOOTD);
      console.log("OOTD created");
    } catch (error) {
      console.error("Error trying to create ootd", error);
      throw error;
    }
    setImageUri(downloadUrl);
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
      <View style={styles.body}>
        <View>
          {!imageUri && (
            <Button title="Upload YUYL" onPress={handlePickImage}></Button>
          )}
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.ootdImage}></Image>
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
  ootdImage: {
    width: 300,
    height: 400,
  },
});
