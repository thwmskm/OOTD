import { StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import useOutfitStore from "../../../services/stores/outfitStore";
import useUserStore from "../../../services/stores/userStore";
import GridView from "../../components/GridView";
import { db } from "../../../database/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import { colors, spacing } from "../../../constants/theme";

//To pick and choose associated clothing items to 'this' outfit based on clothing collection
const LinkClothing = () => {
  const router = useRouter();
  const outfit = useOutfitStore((state) => state.outfit);
  const setOutfit = useOutfitStore((state) => state.setOutfit);
  const user = useUserStore((state) => state.user);

  const [selected, setSelected] = useState([]);
  const [clothingList, setClothingList] = useState([]);

  useEffect(() => {
    const initClothing = async () => {
      try {
        if (!user) return;

        const clothingsRef = collection(db, "clothings");
        const q = query(clothingsRef, where("uid", "==", user.uid));

        const snapshot = await getDocs(q);
        const snapshotList = snapshot.docs.map((doc) => ({ ...doc.data() }));
        setClothingList(snapshotList);

        if (outfit.clothingItems) {
          setSelected(outfit.clothingItems);
        }
      } catch (error) {
        console.log("Error loading clothings:", error);
      }
    };
    initClothing();
  }, []);

  const addToList = (item) => {
    const newItem = {
      cid: item.cid,
      imageUrl: item.imageUrl,
      type: item.type,
      colour: item.colour,
      brand: item.brand,
    };
    setSelected((prevItems) =>
      prevItems.some((i) => i.cid === item.cid)
        ? prevItems.filter((i) => i.cid !== item.cid)
        : [...prevItems, newItem],
    );
  };

  const handleSaveSelected = () => {
    setOutfit("clothingItems", selected);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <FontAwesome5 name="arrow-left" size={18} color={colors.ink} />
        </Pressable>
        <AppText weight="medium" style={styles.headerTitle}>
          Select clothing
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <AppText weight="regular" style={styles.count}>
        {selected.length} selected
      </AppText>

      <View style={styles.body}>
        <GridView
          items={clothingList}
          onItemPress={addToList}
          selectedIds={selected.map((i) => i.cid)}
        />
      </View>

      <View style={styles.footer}>
        <AppButton title="Save" onPress={handleSaveSelected} />
      </View>
    </SafeAreaView>
  );
};

export default LinkClothing;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  headerSpacer: {
    width: 18,
  },
  count: {
    fontSize: 12,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
  },
});
