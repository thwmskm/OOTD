//React Native imports
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Pressable,
  Button,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Tabs, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";

//other file imports
import { useImagePicker } from "../../hooks/useImagePicker";
import useClothingStore from "../../../services/stores/clothingStore";
import useOutfitStore from "../../../services/stores/outfitStore";
import { deleteImage } from "../../../services/Storage";
import { deleteClothing } from "../../../services/clothingService";
import { updateClothing } from "../../../services/clothingService";
import { deleteOutfit } from "../../../services/outfitService";
import { updateOutfit } from "../../../services/outfitService";

//firebase imports
import { db } from "../../../database/firebase";
import { getDoc, doc } from "firebase/firestore";

//misc imports
import { FontAwesome5 } from "@expo/vector-icons";

const Item = () => {
  const router = useRouter();
  const { id, type } = useLocalSearchParams();
  const [item, setItem] = useState(null);

  //clothing Attributes setters
  const clothing = useClothingStore((state) => state.clothing);
  const loadClothing = useClothingStore((state) => state.loadClothing);
  const resetClothingStore = useClothingStore(
    (state) => state.resetClothingStore,
  );

  //outfit Attributes setters
  const outfit = useOutfitStore((state) => state.outfit);
  const loadOutfit = useOutfitStore((state) => state.loadOutfit);
  const resetOutfitStore = useOutfitStore((state) => state.resetOutfitStore);

  //Find and load data for item into clothing/outfit store
  useEffect(() => {
    const fetchItem = async () => {
      if (type === "clothing") {
        const docRef = doc(db, "clothings", id);
        const docSnap = await getDoc(docRef);
        console.log("Doc exists:", docSnap.exists());
        if (docSnap.exists()) {
          setItem(docSnap.data());
          //Load item to ClothingStore
          loadClothing(docSnap.data());
        }
      } else {
        const docRef = doc(db, "outfits", id);
        const docSnap = await getDoc(docRef);
        console.log("Doc exists:", docSnap.exists());
        if (docSnap.exists()) {
          setItem(docSnap.data());
          //Load item to OutfitStore
          loadOutfit(docSnap.data());
        }
      }
    };
    fetchItem();
  }, [id]);

  if (!item) return <Text>Loading...</Text>;

  //back button
  const handleBack = () => {
    resetClothingStore();
    resetOutfitStore();
    router.back();
  };

  //Deleting clothing item button
  const handleDelete = async () => {
    //confirmation for deletion using pop-up
    const flag = false;
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete this ${type} item?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (type === "clothing") {
                const path = clothing.imageUrl;

                await deleteImage(path);
                await deleteClothing(clothing.cid);

                resetClothingStore();
                router.back();
              } else {
                const path = outfit.imageUrl;

                await deleteImage(path);
                await deleteOutfit(outfit.oid);

                resetOutfitStore();
                router.back();
              }
            } catch (error) {
              console.log("Failed to delete file!", error);
            }
          },
        },
      ],
    );
  };

  const onImagePicked = async (uri) => {
    if (type === "clothing") {
      try {
        //Delete old image
        if (clothing.imageUrl) await deleteImage(clothing.imageUrl);

        //Upload new image
        const downloadUrl = await storeClothingItem(
          uri,
          clothing.cid,
          clothing.uid,
        );

        // Update ClothingStore and Firestore
        const updatedClothing = { ...clothing, imageUrl: downloadUrl };
        loadClothing(updatedClothing);
        await updateClothing(updatedClothing);
      } catch (error) {
        console.log(`Failed to update ${type} image`, error);
      }
    } else {
      try {
        //Delete old image
        if (outfit.imageUrl) await deleteImage(outfit.imageUrl);

        //Upload new image
        const downloadUrl = await storeOutfitItem(uri, outfit.oid, outfit.uid);

        // Update OutfitStore and Firestore
        const updatedOutfit = { ...outfit, imageUrl: downloadUrl };
        loadOutfit(updatedOutfit);
        await updateOutfit(updatedOutfit);
      } catch (error) {
        console.log(`Failed to update ${type} image`, error);
      }
    }
  };

  const { pickImage } = useImagePicker(onImagePicked);

  //"Pencil" edit icon pushes users to respective item editing screen under /(attributes)
  const handleEdit = () => {
    try {
      if (type === "clothing") {
        const cid = clothing.cid;
        router.push({
          pathname: "/EditClothing",
          params: { cid: cid },
        });
      } else {
        const oid = outfit.oid;
        router.push({
          pathname: "/EditOutfit",
          params: { oid: oid },
        });
      }
    } catch (error) {
      console.log("Error while pushing to edit item", error);
    }
  };

  return (
    <View>
      <FontAwesome5
        name="arrow-left"
        size={24}
        color="black"
        onPress={handleBack}
      ></FontAwesome5>
      <View style={styles.imageView}>
        {type === "clothing" ? (
          <Image
            source={{
              uri: clothing.imageUrl,
            }}
            style={styles.image}
          />
        ) : (
          <Image
            source={{
              uri: outfit.imageUrl,
            }}
            style={styles.image}
          />
        )}
      </View>
      <View style={styles.itemInfo}>
        {type === "clothing" ? (
          <>
            <View style={styles.colourInfo}>
              <Text>Colour: {clothing.colour}</Text>
              <View
                style={[styles.swatch, { backgroundColor: clothing.colour }]}
              ></View>
            </View>
            <View style={styles.brandInfo}>
              <Text>Brand: {clothing.brand}</Text>
            </View>
            <View style={styles.material}>
              <Text>Material: {clothing.material}</Text>
            </View>
            <View styles={styles.seasonInfo}>
              <Text>Season: {clothing.season}</Text>
            </View>
            <View style={styles.typeInfo}>
              <Text>Type: {clothing.type}</Text>
            </View>
            <View style={styles.inOutInfo}>
              <Text>InOut: {clothing.inOut}</Text>
            </View>
          </>
        ) : (
          <>
            <View>
              <Text>Style: {outfit.style}</Text>
            </View>
            <View>
              <Text>Season: {outfit.season}</Text>
            </View>
            <View>
              <Text>Occasion: {outfit.occasion}</Text>
            </View>
            <View>
              <Text>Associated Clothings: </Text>
              <View style={styles.list}>
                {outfit.clothingItems.map((item) => (
                  <Image
                    key={item.cid}
                    source={{ uri: item.imageUrl }}
                    style={styles.clothingImage}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </View>
      <View style={styles.editSect}>
        <FontAwesome5
          name="pencil-alt"
          size={24}
          color="black"
          onPress={handleEdit}
        />
        <FontAwesome5
          name="trash"
          size={24}
          color="black"
          onPress={handleDelete}
        />
      </View>
    </View>
  );
};

export default Item;

const styles = StyleSheet.create({
  backBtn: {
    width: "10%",
    backgroundColor: "none",
  },
  imageView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: 300,
    margin: 20,
  },
  swatch: {
    borderRadius: 10,
    width: 20,
    height: 20,
    borderWidth: 1,
  },
  editSect: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginTop: 20,
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
});
