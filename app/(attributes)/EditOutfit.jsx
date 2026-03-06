//React imports
import React, { useEffect, useState } from "react";

//React Native imports
import {
  StyleSheet,
  Pressable,
  TextInput,
  View,
  Image,
  Text,
  Button,
  ScrollView,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import uuid from "react-native-uuid";

//Firebase Imports
import { FB_auth } from "../../database/firebase";
import { db } from "../../database/firebase.js";
import { doc, getDoc } from "firebase/firestore";

//other file imports
import { updateOutfit, createOutfit } from "../../services/outfitService";
import useOutfitStore from "../../services/stores/outfitStore";
import { storeOutfit } from "../../services/Storage";

//Misc imports
import { FontAwesome5 } from "@expo/vector-icons";

/*-------------------------------------------------------------------------------------------*/
const EditOutfit = () => {
  const router = useRouter();
  const user = FB_auth.currentUser;
  //when editing existing outfit, must identify outfit with oid
  const { imageUrl, oid } = useLocalSearchParams();

  //OutfitStore setters
  const outfit = useOutfitStore((state) => state.outfit);
  const loadOutfit = useOutfitStore((state) => state.loadOutfit);
  const setOutfit = useOutfitStore((state) => state.setOutfit);
  const resetOutfitStore = useOutfitStore((state) => state.resetOutfitStore);

  //outfitStore

  //keeping track of image loading status
  const [loadStatus, setLoadStatus] = useState(true);

  //Reset outfitStore, setimageUrl, and load preexisting outfit (if exists)
  useEffect(() => {
    const initItem = async () => {
      setLoadStatus(true);
      resetOutfitStore();
      try {
        //if preexisting outfit
        if (oid) {
          const snap = await getDoc(doc(db, "outfits", oid));
          if (snap.exists()) {
            const data = snap.data();
            loadOutfit(data);
          } else {
            console.log("No outfit found with oid:", oid);
          }
          //if new outfit
        } else if (imageUrl) {
          setOutfit("imageUrl", imageUrl);
        }
      } catch (err) {
        console.error("error while fetching outfit/while setting image", err);
      } finally {
        setLoadStatus(false);
      }
    };
    initItem();
  }, [imageUrl, oid]);

  //save all attributes and create/update Outfit
  const save = async () => {
    if (!user) return;
    if (outfit.oid) {
      //update exisiting outfit
      try {
        await updateOutfit(outfit.oid, outfit);
      } catch {
        console.error("Error trying to update outfit", error);
      }
      router.back();
    } else {
      //generate new oid
      const newOid = uuid.v4().toString();
      //obtain downaloadUrl and store image in firebase storage
      const downloadUrl = await storeOutfit(imageUrl, newOid, user.uid);
      console.log("image uploaded");
      //create new outfit item
      const newOutfit = {
        oid: newOid,
        uid: user.uid,
        imageUrl: downloadUrl,
        style: outfit.style,
        season: outfit.season,
        occasion: outfit.occasion,
        favourite: outfit.favourite,
        clothingItems: outfit.clothingItems,
        createdAt: new Date(),
      };
      console.log(newOutfit);
      try {
        console.log("outfit created");
        await createOutfit(newOutfit);
      } catch (error) {
        console.error("Error trying to create outfit", error);
        throw error;
      }
    }
    resetOutfitStore();
    router.replace("/(tabs)/closet");
  };

  //set favourite
  const isFavourite = () => {
    if (outfit.favourite == true) {
      setOutfit("favourite", false);
    } else {
      setOutfit("favourite", true);
    }
  };

  return (
    <ScrollView style={styles.body}>
      {loadStatus ? (
        <Text>Loading...</Text>
      ) : outfit.imageUrl ? (
        <Image source={{ uri: outfit.imageUrl }} style={styles.image}></Image>
      ) : (
        <Text>No image found</Text>
      )}

      <Pressable onPress={isFavourite} style={styles.attribute}>
        <FontAwesome5
          size={30}
          name="heart"
          solid={outfit.favourite}
          style={[
            styles.favouriteIcon,
            { color: outfit.favourite ? "red" : "lightgray" },
          ]}
        />
      </Pressable>
      <View style={styles.attribute}>
        <Text>Style:</Text>
        <TextInput
          onChangeText={(text) => setOutfit("style", text)}
          value={outfit.style}
          placeholder="Enter style"
          style={styles.input}
        ></TextInput>
      </View>
      <View style={styles.attribute}>
        <Text>Occasion:</Text>
        <TextInput
          onChangeText={(text) => setOutfit("occasion", text)}
          value={outfit.occasion}
          placeholder="Enter occasion"
          style={styles.input}
        ></TextInput>
      </View>
      <Pressable
        onPress={() =>
          router.push({ pathname: "/season", param: { type: "outfit" } })
        }
        style={styles.attribute}
      >
        <Text>Seasonal:</Text>
        <Text style={styles.seasonValue}>{outfit.season}</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          router.push({ pathname: "/linkClothing" });
        }}
      >
        <Text>Associated Clothing:</Text>
        {loadStatus ? (
          <Text>Loading...</Text>
        ) : outfit.clothingItems ? (
          <View style={styles.list}>
            {outfit.clothingItems.map((item) => (
              <Image
                key={item.cid}
                source={{ uri: item.imageUrl }}
                style={styles.clothingImage}
              />
            ))}
            <View style={styles.addClothingImage}>
              <FontAwesome5 name="plus" size={24} style={styles.icon} />
            </View>
          </View>
        ) : (
          <Text>No clothings</Text>
        )}
      </Pressable>
      <Button title="Save" style={styles.save} onPress={save}>
        Save
      </Button>
    </ScrollView>
  );
};

export default EditOutfit;

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
  list: {
    justifyContent: "left",
    paddingBottom: 40,
    display: "flex",
    flexDirection: "row",
  },
  clothingImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  addClothingImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "lightgray",
  },
  icon: {
    margin: "auto",
    color: "gray",
  },
});
