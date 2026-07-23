import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Pressable,
  TextInput,
  View,
  Image,
  Text,
  Button,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import uuid from "react-native-uuid";
import { db } from "../../../database/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import {
  updateClothing,
  createClothing,
} from "../../../services/clothingService";
import useClothingStore from "../../../services/stores/clothingStore";
import useUserStore from "../../../services/stores/userStore";
import { storeClothingItem } from "../../../services/Storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { COLOURS } from "../../components/ColourPicker.jsx";
import {
  incrementStatCount,
  incrementTotalItems,
} from "../../../services/userStatsService.ts";

/*-------------------------------------------------------------------------------------------*/
const EditClothing = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  //when editing existing clothing, must identify clothing with cid
  const { imageUrl, cid } = useLocalSearchParams();

  //clothingStore setters
  const clothing = useClothingStore((state) => state.clothing);
  const loadClothing = useClothingStore((state) => state.loadClothing);
  const setClothing = useClothingStore((state) => state.setClothing);
  const resetClothingStore = useClothingStore(
    (state) => state.resetClothingStore,
  );

  //keeping track of image loading status
  const [loadStatus, setLoadStatus] = useState(true);

  //track original brand so save() can diff against it for stat adjustments
  const [originalBrand, setOriginalBrand] = useState(null);

  //Reset clothingStore, setimageUrl, and load preexisting clothing (if exists)
  useEffect(() => {
    const initItem = async () => {
      setLoadStatus(true);
      resetClothingStore();
      try {
        if (cid) {
          const snap = await getDoc(doc(db, "clothings", cid));
          if (snap.exists()) {
            const data = snap.data();
            loadClothing(data);
            setOriginalBrand(data.brand ?? null); //capture before edits happen
          } else {
            console.log("No clothing found with cid:", cid);
          }
        } else if (imageUrl) {
          setClothing("imageUrl", imageUrl);
        }
      } catch (err) {
        console.error("error while fetching clothing/while setting image", err);
      } finally {
        setLoadStatus(false);
      }
    };
    initItem();
  }, [imageUrl, cid]);

  //save all attributes and create/update Clothing
  const save = async () => {
    if (!user) return;
    if (clothing.cid) {
      //update existing clothing
      try {
        await updateClothing(clothing.cid, clothing);

        //adjust brandCounts only if brand actually changed
        if (originalBrand !== clothing.brand) {
          if (originalBrand) {
            await incrementStatCount(
              user.uid,
              "brandCounts",
              originalBrand,
              -1,
            );
          }
          if (clothing.brand) {
            await incrementStatCount(
              user.uid,
              "brandCounts",
              clothing.brand,
              1,
            );
          }
        }
      } catch (error) {
        console.error("Error trying to update clothing", error);
        throw error;
      }
      router.back();
    } else {
      //generate new cid
      const newCid = uuid.v4().toString();
      const downloadUrl = await storeClothingItem(imageUrl, newCid, user.uid);
      console.log("image uploaded");
      const newClothing = {
        cid: newCid,
        uid: user.uid,
        imageUrl: downloadUrl,
        colour: clothing.colour,
        brand: clothing.brand,
        material: clothing.material,
        season: clothing.season,
        type: clothing.type,
        inOut: clothing.inOut,
        favourite: clothing.favourite,
        createdAt: new Date(),
      };
      console.log(newClothing);
      try {
        await createClothing(newClothing);
        console.log("clothing created");
        if (clothing.brand) {
          await incrementStatCount(user.uid, "brandCounts", clothing.brand);
        }
        await incrementTotalItems(user.uid);
      } catch (error) {
        console.error("Error trying to create clothing", error);
        throw error;
      }
      resetClothingStore();
      router.replace("/(tabs)/closet");
    }
  };

  //set favourite
  const isFavourite = () => {
    if (clothing.favourite == true) {
      setClothing("favourite", false);
    } else {
      setClothing("favourite", true);
    }
  };

  return (
    <ScrollView style={styles.body}>
      {loadStatus ? (
        <Text>Loading...</Text>
      ) : clothing.imageUrl ? (
        <Image source={{ uri: clothing.imageUrl }} style={styles.image}></Image>
      ) : (
        <Text>No image found</Text>
      )}

      <Pressable onPress={isFavourite} style={styles.attribute}>
        <FontAwesome5
          size={30}
          name="heart"
          solid={clothing.favourite}
          style={[
            styles.favouriteIcon,
            { color: clothing.favourite ? "red" : "lightgray" },
          ]}
        />
      </Pressable>
      <Pressable
        onPress={() => router.push("/colour")}
        style={styles.attribute}
      >
        <Text>Colour:</Text>
        {clothing.colour && (
          <View style={styles.colourRow}>
            <View
              style={[
                styles.swatch,
                {
                  backgroundColor:
                    COLOURS.find((c) => c.label === clothing.colour)?.hex ??
                    "#ccc",
                },
                ["white", "cream", "silver", "beige"].includes(
                  clothing.colour,
                ) && styles.swatchBordered,
              ]}
            />
            <Text>{clothing.colour}</Text>
          </View>
        )}
      </Pressable>
      <View style={styles.attribute}>
        <Text>Brand:</Text>
        <TextInput
          onChangeText={(text) => setClothing("brand", text)}
          value={clothing.brand}
          placeholder="Enter brand"
          style={styles.input}
        ></TextInput>
      </View>
      <View style={styles.attribute}>
        <Text>Material:</Text>
        <TextInput
          onChangeText={(text) => setClothing("material", text)}
          value={clothing.material}
          placeholder="Enter material"
          style={styles.input}
        ></TextInput>
      </View>
      <Pressable
        onPress={() =>
          router.push({ pathname: "/season", params: { type: "clothing" } })
        }
        style={styles.attribute}
      >
        <Text>Seasonal:</Text>
        <Text style={styles.seasonValue}>{clothing.season}</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/type")} style={styles.attribute}>
        <Text>Clothing Type:</Text>
        <Text style={styles.typeValue}>{clothing.type}</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/inOut")} style={styles.attribute}>
        <Text>Indoor/Outdoor:</Text>
        <Text style={styles.inOutValue}>{clothing.inOut}</Text>
      </Pressable>
      <Button title="Save" style={styles.save} onPress={save}>
        Save
      </Button>
    </ScrollView>
  );
};

export default EditClothing;

const styles = StyleSheet.create({
  body: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: 50,
    flex: 1,
    marginBottom: 50,
  },
  image: {
    alignSelf: "center",
    width: 300,
    height: 300,
    marginVertical: 20,
  },
  attribute: {
    padding: 10,
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "gray",
  },
  favouriteIcon: {
    color: "light gray",
  },
  input: {
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  swatch: {
    borderRadius: 10,
    width: 20,
    height: 20,
    borderWidth: 1,
  },
  colourRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  swatchBordered: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
