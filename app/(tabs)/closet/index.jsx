import { StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useImagePicker } from "../../hooks/useImagePicker";
import useClosetFilter from "../../hooks/useClosetFilter";
import useClosetSort from "../../hooks/useClosetSort";
import useUserStore from "../../../services/stores/userStore";
import { db } from "../../../database/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import GridView from "../../components/GridView.jsx";
import FloatButton from "./FloatButton";
import ClosetFilterBar from "./ClosetFilterBar";
import AppText from "../../components/AppText";
import { colors, spacing, radius } from "../../../constants/theme";

const TABS = [
  { key: "clothing", label: "Clothing" },
  { key: "outfit", label: "Outfits" },
];

const ClosetIndex = () => {
  const router = useRouter();
  const [clothingItems, setClothingItems] = useState([]);
  const [outfitItems, setOutfitItems] = useState([]);
  const [tabs, setTabs] = useState("clothing");

  const user = useUserStore((state) => state.user);

  const filter = useClosetFilter(clothingItems);
  const sort = useClosetSort(filter.filteredItems);

  const fetchClothings = async () => {
    try {
      if (!user) return;
      const clothingsRef = collection(db, "clothings");
      const q = query(clothingsRef, where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClothingItems(list);
    } catch (error) {
      console.log("Error loading clothings:", error);
    }
  };

  const fetchOutfits = async () => {
    try {
      if (!user) return;
      const outfitsRef = collection(db, "outfits");
      const q = query(outfitsRef, where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOutfitItems(list);
    } catch (error) {
      console.log("Error loading outfits:", error);
    }
  };

  const handleItemPress = (item) => {
    router.push({
      pathname: `/(tabs)/closet/${item.id}`,
      params: { type: tabs },
    });
  };

  useEffect(() => {
    fetchClothings();
    fetchOutfits();
  }, []);

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
        params: { imageUrl: uri, type: pickedType },
      });
    });
  };

  const activeCount =
    tabs === "clothing" ? sort.sortedItems.length : outfitItems.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <AppText weight="bold" style={styles.title}>
          Closet
        </AppText>
        <AppText weight="regular" style={styles.count}>
          {activeCount} {tabs === "clothing" ? "items" : "outfits"}
        </AppText>
      </View>

      <View style={styles.segmented}>
        {TABS.map(({ key, label }) => {
          const active = tabs === key;
          return (
            <Pressable
              key={key}
              onPress={() => setTabs(key)}
              style={[styles.segment, active && styles.segmentActive]}
            >
              <AppText
                weight="medium"
                style={[styles.segmentText, active && styles.segmentTextActive]}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {tabs === "clothing" && <ClosetFilterBar filter={filter} sort={sort} />}

      <View style={styles.body}>
        <GridView
          tab={tabs}
          items={tabs === "clothing" ? sort.sortedItems : outfitItems}
          onItemPress={handleItemPress}
        />
        <FloatButton onCreate={handlePickClothing} />
      </View>
    </SafeAreaView>
  );
};

export default ClosetIndex;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    color: colors.ink,
  },
  count: {
    fontSize: 12,
    color: colors.textMuted,
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: colors.paper,
  },
  segmentText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  segmentTextActive: {
    color: colors.ink,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
});
