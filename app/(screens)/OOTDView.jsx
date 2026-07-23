//Ootd page for editing and viewing already posted ootd. Saves on the spot rather than routing home
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Button,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import useOOTDStore from "../../services/stores/ootdStore";
import useUserStore from "../../services/stores/userStore";
import { useRouter } from "expo-router";
import { updateOOTD } from "../../services/ootdService";
import { deleteOOTD } from "../../services/ootdService";
import { getOOTD } from "../../services/ootdService";
import { FontAwesome5 } from "@expo/vector-icons";
import useStreak from "../hooks/useStreak";
import ColourPicker, { COLOURS } from "../components/ColourPicker";
import {
  incrementTotalOOTDs,
  incrementStatCount,
  incrementStatCounts,
} from "../../services/userStatsService";

const OOTDView = () => {
  const router = useRouter();
  //userStore initialization
  const user = useUserStore((state) => state.user);

  //ootdStore initialization
  const ootd = useOOTDStore((state) => state.ootd);
  const setOotd = useOOTDStore((state) => state.setOotd);
  const resetOotdStore = useOOTDStore((state) => state.resetOotdStore);

  //initialize useStreak hook
  const { deleteStreak } = useStreak(user?.uid ?? "");

  //states for the saves for the oots post
  const [saves, setSaves] = useState(0);
  const [flag, setFlag] = useState(false);
  //state for editing caption mode
  const [isEditing, setIsEditing] = useState(false);
  //state to keep caption changes
  const [caption, setCaption] = useState(ootd.caption);
  const [style, setStyle] = useState(ootd.style);
  const [colourScheme, setColourScheme] = useState(ootd.colourScheme ?? []);
  //state for createdAt for editing/deleting permissions
  const [createdAt, setCreatedAt] = useState("");

  //create date of upload (YYY-MM-DD)
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  //Fetch saves from db
  useEffect(() => {
    if (!user) return;

    setCaption(ootd.caption);

    const fetchOotd = async () => {
      try {
        const id = `${user.uid}_${date}`;
        const fetched = await getOOTD(id);
        if (fetched) {
          setSaves(fetched.saves ?? 0);
          setCreatedAt(fetched.createdAt);
          setFlag(true);
        }
      } catch (error) {
        console.error("Error fetching ootd", error);
      }
    };

    fetchOotd();
  }, [user?.uid, date, ootd.caption]);

  //condition to see if edit duration is up or not
  const canEdit =
    createdAt && Date.now() - createdAt.toMillis() < 10 * 60 * 1000;

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
              //delete ootd from db
              await deleteOOTD(id);

              //decrement the ootd stats
              await incrementTotalOOTDs(user.uid, -1);
              if (ootd.style) {
                await incrementStatCount(
                  user.uid,
                  "styleCounts",
                  ootd.style,
                  -1,
                );
              }
              const colourLabels = ootd.colourScheme ?? [];
              if (colourLabels.length) {
                await incrementStatCounts(
                  user.uid,
                  "colourCounts",
                  colourLabels,
                  -1,
                );
              }
              //reset ootdStore
              resetOotdStore();
              //adjust streak accordingly
              await deleteStreak();
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
      await updateOOTD(id, { caption, style, colourScheme });

      //adjust styleCounts if style actually changed
      if (ootd.style !== style) {
        if (ootd.style) {
          await incrementStatCount(user.uid, "styleCounts", ootd.style, -1);
        }
        if (style) {
          await incrementStatCount(user.uid, "styleCounts", style, 1);
        }
      }

      //adjust colourCounts: decrement removed colours, increment added ones
      const oldColours = ootd.colourScheme ?? [];
      const newColours = colourScheme ?? [];
      const removed = oldColours.filter((c) => !newColours.includes(c));
      const added = newColours.filter((c) => !oldColours.includes(c));

      if (removed.length) {
        await incrementStatCounts(user.uid, "colourCounts", removed, -1);
      }
      if (added.length) {
        await incrementStatCounts(user.uid, "colourCounts", added, 1);
      }

      setOotd("caption", caption);
      setOotd("style", style);
      setOotd("colourScheme", colourScheme);
      toggleEdit();
    } catch (error) {
      console.error("Error while updating ootd", error);
      throw error;
    }
  };

  return !isEditing ? (
    <>
      <Text>{date}</Text>
      <Image source={{ uri: ootd.imageUrl }} style={styles.ootdImage}></Image>
      {flag ? (
        <View>
          <Text>Saves: {saves}</Text>
        </View>
      ) : (
        <></>
      )}
      <View style={styles.captionArea}>
        <Text>{ootd.caption}</Text>
      </View>
      <Text>Style: {ootd.style}</Text>
      <View style={styles.tagRow}>
        {(ootd.colourScheme ?? []).map((label) => {
          const hex = COLOURS.find((c) => c.label === label)?.hex ?? "#ccc";
          return (
            <View key={label} style={styles.tag}>
              <View style={[styles.tagSwatch, { backgroundColor: hex }]} />
              <Text style={styles.tagLabel}>{label}</Text>
            </View>
          );
        })}
      </View>
      {canEdit === true ? (
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
      ) : (
        <></>
      )}
    </>
  ) : (
    <ScrollView style={styles.body}>
      <Text>{date}</Text>
      <Image source={{ uri: ootd.imageUrl }} style={styles.ootdImage}></Image>
      {flag ? (
        <View>
          <Text>Saves: {saves}</Text>
        </View>
      ) : (
        <></>
      )}
      <View style={styles.captionArea}>
        <TextInput
          onChangeText={setCaption}
          value={caption}
          defaultValue={ootd.caption}
          style={styles.textInput}
        ></TextInput>
      </View>
      <TextInput
        onChangeText={setStyle}
        value={style}
        defaultValue={ootd.style}
        style={styles.textInput}
      ></TextInput>
      <ColourPicker selected={colourScheme} onChange={setColourScheme} />
      <View style={styles.editSection}>
        <Button title="Save" onPress={handleSave}></Button>
      </View>
    </ScrollView>
  );
};

export default OOTDView;

const styles = StyleSheet.create({
  body: {
    marginTop: 50,
    marginBottom: 50,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
  },
  ootdImage: {
    width: 300,
    height: 400,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 6,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagSwatch: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  tagLabel: {
    fontSize: 12,
    textTransform: "capitalize",
  },
});
