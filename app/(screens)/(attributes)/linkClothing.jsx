import { StyleSheet, View, Pressable, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import useOutfitStore from "../../../services/stores/outfitStore";
import GridView from "../../components/GridView";
import { FB_auth, db } from "../../../database/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

//To pick and choose associated clothing items to 'this' outfit based on clothing collection
const linkClothing = () => {
  const router = useRouter();
  const outfit = useOutfitStore((state) => state.outfit);
  const setOutfit = useOutfitStore((state) => state.setOutfit);

  //collection of selected clothing items to be associated to outfit
  const [selected, setSelected] = useState([]);

  //Every Clothing item in closet
  const [clothingList, setClothingList] = useState([]);

  //Fetch all clothings from db to display
  useEffect(() => {
    const initClothing = async () => {
      try {
        const user = FB_auth.currentUser;
        if (!user) return;

        const clothingsRef = collection(db, "clothings");
        const q = query(clothingsRef, where("uid", "==", user.uid));

        const snapshot = await getDocs(q);

        const snapshotList = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setClothingList(snapshotList);
        //
        if (outfit.clothingItems) {
          setSelected(outfit.clothingItems);
        }
      } catch (error) {
        console.log("Error loading clothings:", error);
      }
    };
    initClothing();
  }, []);

  //Add or remove selected items to list of associated clothings
  const addToList = (item) => {
    //Create new ClothingSnapshot item
    const newItem = {
      cid: item.cid,
      imageUrl: item.imageUrl,
      type: item.type,
      colour: item.colour,
      brand: item.brand,
    };
    //Add item if not in selected yet, remove if it exists already
    setSelected((prevItems) =>
      prevItems.some((i) => i.cid === item.cid)
        ? prevItems.filter((i) => i.cid !== item.cid)
        : [...prevItems, newItem],
    );
  };

  //Save list of selected clothings to outfit object
  const handleSaveSelected = () => {
    setOutfit("clothingItems", selected);
    router.back();
  };

  return (
    <View>
      <GridView
        items={clothingList}
        onItemPress={addToList}
        selectedIds={selected.map((i) => i.cid)}
      ></GridView>
      <Button
        style={styles.saveBtn}
        title="Save"
        onPress={handleSaveSelected}
      ></Button>
    </View>
  );
};

export default linkClothing;

const styles = StyleSheet.create({
  saveBtn: {
    display: "center",
    position: "fixed",
    zIndex: 999,
  },
});
