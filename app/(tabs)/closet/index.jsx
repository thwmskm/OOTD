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
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useImagePicker } from "../../hooks/useImagePicker";
import { FB_auth, db } from "../../../database/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import GridView from "../../components/GridView.jsx";
import FloatButton from "./FloatButton";

const ClosetIndex = () => {
  const router = useRouter();
  const [clothingItems, setClothingItems] = useState([]);
  const [outfitItems, setOutfitItems] = useState([]);
  const [tabs, setTabs] = useState("clothing");

  //FUNCTION TO CALL THE CLOTHINGS FROM THE CLOSET AND DISPLAY FOR USER
  const fetchClothings = async () => {
    try {
      const user = FB_auth.currentUser;
      if (!user) return;

      const clothingsRef = collection(db, "clothings");
      const q = query(clothingsRef, where("uid", "==", user.uid));

      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setClothingItems(list);
    } catch (error) {
      console.log("Error loading clothings:", error);
    }
  };

  //FUNCTION TO CALL THE OUTFITS FROM THE CLOSET AND DISPLAY FOR USER
  const fetchOutfits = async () => {
    try {
      const user = FB_auth.currentUser;
      if (!user) return;

      const outfitsRef = collection(db, "outfits");
      const q = query(outfitsRef, where("uid", "==", user.uid));

      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOutfitItems(list);
    } catch (error) {
      console.log("Error loading outfits:", error);
    }
  };

  //TO NAVIGATE TO INDIVIDUAL ITEM SCREEN BASED ON TYPE OF ITEM (CLOTHING OR OUTFIT)
  const handleItemPress = (item) => {
    router.push({
      pathname: `/(tabs)/closet/${item.id}`,
      params: { type: tabs },
    });
  };

  //TO CALL ITEMS TO DISPLAY
  useEffect(() => {
    fetchClothings();
    fetchOutfits();
  }, []);

  //SAME AS USEEFFECT BUT FOR REMOUNTING AFTER ADDING NEW ITEM
  useFocusEffect(
    useCallback(() => {
      fetchClothings();
      fetchOutfits();
    }, []),
  );

  const { pickImage } = useImagePicker();

  const handlePickClothing = (pickedType) => {
    pickImage((uri) => {
      router.push({
        pathname: "/(attributes)",
        params: {
          imageUrl: uri,
          type: pickedType, // clothing or outfit
        },
      });
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.div}>
        <View style={styles.tabToggle}>
          <Pressable
            style={styles.tab}
            onPress={() => {
              setTabs("clothing");
            }}
          >
            <Text>Clothings</Text>
          </Pressable>
          <Pressable
            style={styles.tab}
            onPress={() => {
              setTabs("outfit");
            }}
          >
            <Text>Outfits</Text>
          </Pressable>
        </View>
        <FloatButton onCreate={handlePickClothing}></FloatButton>
        <GridView
          tab={tabs}
          items={tabs === "clothing" ? clothingItems : outfitItems}
          onItemPress={handleItemPress}
        ></GridView>
      </View>
    </SafeAreaView>
  );
};

export default ClosetIndex;

const styles = StyleSheet.create({
  div: {
    flex: 1,
    padding: 10,
  },
  safeArea: {
    flex: 1,
  },

  tabToggle: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: 30,
    backgroundColor: "gray",
  },
  tab: {
    width: "50%",
    height: "100%",
  },
});
