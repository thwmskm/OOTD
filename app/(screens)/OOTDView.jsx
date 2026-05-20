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
import useOOTDStore from "../../services/stores/ootdStore";
import useUserStore from "../../services/stores/userStore";
import resetOotdStore from "../../services/stores/userStore";
import { useRouter } from "expo-router";
import { updateOOTD } from "../../services/ootdService";
import { deleteOOTD } from "../../services/ootdService";
import { getOOTD } from "../../services/ootdService";
import { FontAwesome5 } from "@expo/vector-icons";

const OOTDView = () => {
  const router = useRouter();
  //userStore initialization
  const user = useUserStore((state) => state.user);

  //ootdStore initialization
  const ootd = useOOTDStore((state) => state.ootd);
  const setOotd = useOOTDStore((state) => state.setOotd);
  const resetOotdStore = useOOTDStore((state) => state.resetOotdStore);

  //states for the likes and saves for the oots post
  const [likes, setLikes] = useState(0);
  const [saves, setSaves] = useState(0);
  const [flag, setFlag] = useState(false);
  //state for editing caption mode
  const [isEditing, setIsEditing] = useState(false);
  //state to keep caption changes
  const [text, setText] = useState(ootd.caption);

  //create date of upload (YYY-MM-DD)
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  //Fetch likes and saves from db
  useEffect(() => {
    if (!user) return;

    setText(ootd.caption);

    const fetchOotd = async () => {
      try {
        const id = `${user.uid}_${date}`;
        const fetched = await getOOTD(id);
        if (fetched) {
          setLikes(fetched.likes ?? 0);
          setSaves(fetched.saves ?? 0);
          setFlag(true);
        }
      } catch (error) {
        console.error("Error fetching ootd", error);
      }
    };

    fetchOotd();
  }, [user?.uid, date, ootd.caption]);

  //toggle between editing and not editing state
  const toggleEdit = () => setIsEditing((prev) => !prev);

  //handle deletion of ootd
  const handleDelete = async () => {
    if (!user) return;

    Alert.alert(
      "Delete OOTD",
      "Are you sure you want to delete today's OOTD? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const id = `${user.uid}_${date}`;
              await deleteOOTD(id);
              resetOotdStore();
              router.replace("/(tabs)");
            } catch (error) {
              console.error("Error deleting ootd:", error);
              Alert.alert(
                "Error",
                "Could not delete OOTD. The 10 minute window may have passed.",
              );
            }
          },
        },
      ],
    );
  };

  //write save to db and toggle back isEditing === false
  const handleSave = async () => {
    if (!user) return;

    try {
      const id = `${user.uid}_${date}`;
      await updateOOTD(id, { caption: text });
      setOotd("caption", text);
      toggleEdit();
    } catch (error) {
      console.log("Error while updating ootd caption", error);
    }
  };

  return !isEditing ? (
    <>
      <Text>{date}</Text>
      <Image source={{ uri: ootd.imageUrl }} style={styles.ootdImage}></Image>
      {flag ? (
        <View>
          <Text>Likes: {likes}</Text>
          <Text>Saves: {saves}</Text>
        </View>
      ) : (
        <></>
      )}
      <View style={styles.captionArea}>
        <Text>{ootd.caption}</Text>
      </View>
      <View style={styles.editSection}>
        <FontAwesome5
          name="pencil-alt"
          size={24}
          color="black"
          onPress={toggleEdit}
        />
        <FontAwesome5
          name="trash"
          size={24}
          color="black"
          onPress={handleDelete}
        />
      </View>
    </>
  ) : (
    <>
      <Text>{date}</Text>
      <Image source={{ uri: ootd.imageUrl }} style={styles.ootdImage}></Image>
      {flag ? (
        <View>
          <Text>Likes: {likes}</Text>
          <Text>Saves: {saves}</Text>
        </View>
      ) : (
        <></>
      )}
      <View style={styles.captionArea}>
        <TextInput
          onChangeText={setText}
          value={text}
          defaultValue={ootd.caption}
          style={styles.textInput}
        ></TextInput>
      </View>
      <View style={styles.editSection}>
        <Button title="Save" onPress={handleSave}></Button>
      </View>
    </>
  );
};

export default OOTDView;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: "black",
  },
  ootdImage: {
    width: 300,
    height: 400,
  },
});
