import { StyleSheet, View, Image, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useImagePicker } from "../../hooks/useImagePicker";
import useClothingStore from "../../../services/stores/clothingStore";
import useOutfitStore from "../../../services/stores/outfitStore";
import useUserStore from "../../../services/stores/userStore";
import {
  deleteImage,
  storeClothingItem,
  storeOutfitItem,
} from "../../../services/Storage";
import {
  deleteClothing,
  updateClothing,
} from "../../../services/clothingService";
import { deleteOutfit, updateOutfit } from "../../../services/outfitService";
import { COLOURS } from "../../components/ColourPicker.jsx";
import { db } from "../../../database/firebase";
import { getDoc, doc } from "firebase/firestore";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  incrementStatCount,
  incrementTotalItems,
} from "../../../services/userStatsService";
import AppText from "../../components/AppText";
import AttributeRow from "../../components/AttributeRow";
import { colors, spacing, radius } from "../../../constants/theme";

const Item = () => {
  const router = useRouter();
  const { id, type } = useLocalSearchParams();
  const [item, setItem] = useState(null);

  const clothing = useClothingStore((state) => state.clothing);
  const loadClothing = useClothingStore((state) => state.loadClothing);
  const resetClothingStore = useClothingStore(
    (state) => state.resetClothingStore,
  );

  const outfit = useOutfitStore((state) => state.outfit);
  const loadOutfit = useOutfitStore((state) => state.loadOutfit);
  const resetOutfitStore = useOutfitStore((state) => state.resetOutfitStore);

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchItem = async () => {
      if (type === "clothing") {
        const docRef = doc(db, "clothings", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItem(docSnap.data());
          loadClothing(docSnap.data());
        }
      } else {
        const docRef = doc(db, "outfits", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItem(docSnap.data());
          loadOutfit(docSnap.data());
        }
      }
    };
    fetchItem();
  }, [id]);

  const handleBack = () => {
    resetClothingStore();
    resetOutfitStore();
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete item",
      `Are you sure you want to delete this ${type} item?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (type === "clothing") {
                await deleteImage(clothing.imageUrl);
                await deleteClothing(clothing.cid);

                if (clothing.brand) {
                  await incrementStatCount(
                    user.uid,
                    "brandCounts",
                    clothing.brand,
                    -1,
                  );
                }
                await incrementTotalItems(user.uid, -1);

                resetClothingStore();
                router.back();
              } else {
                await deleteImage(outfit.imageUrl);
                await deleteOutfit(outfit.oid);

                resetOutfitStore();
                router.back();
              }
            } catch (error) {
              console.error("Failed to delete file!", error);
            }
          },
        },
      ],
    );
  };

  const onImagePicked = async (uri) => {
    if (type === "clothing") {
      try {
        if (clothing.imageUrl) await deleteImage(clothing.imageUrl);
        const downloadUrl = await storeClothingItem(
          uri,
          clothing.cid,
          clothing.uid,
        );
        const updatedClothing = { ...clothing, imageUrl: downloadUrl };
        loadClothing(updatedClothing);
        await updateClothing(clothing.cid, { imageUrl: downloadUrl });
      } catch (error) {
        console.log(`Failed to update ${type} image`, error);
      }
    } else {
      try {
        if (outfit.imageUrl) await deleteImage(outfit.imageUrl);
        const downloadUrl = await storeOutfitItem(uri, outfit.oid, outfit.uid);
        const updatedOutfit = { ...outfit, imageUrl: downloadUrl };
        loadOutfit(updatedOutfit);
        await updateOutfit(outfit.oid, { imageUrl: downloadUrl });
      } catch (error) {
        console.log(`Failed to update ${type} image`, error);
      }
    }
  };

  const { pickImage } = useImagePicker(onImagePicked);

  const handleEdit = () => {
    try {
      if (type === "clothing") {
        router.push({
          pathname: "/EditClothing",
          params: { cid: clothing.cid },
        });
      } else {
        router.push({ pathname: "/EditOutfit", params: { oid: outfit.oid } });
      }
    } catch (error) {
      console.log("Error while pushing to edit item", error);
    }
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.centered}>
          <AppText style={styles.fallbackText}>Loading...</AppText>
        </View>
      </SafeAreaView>
    );
  }

  const colourHex =
    COLOURS.find((c) => c.label === clothing.colour)?.hex ?? colors.line;
  const needsSwatchBorder = ["white", "cream", "silver", "beige"].includes(
    clothing.colour,
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12}>
          <FontAwesome5 name="arrow-left" size={18} color={colors.ink} />
        </Pressable>
        <AppText weight="medium" style={styles.headerTitle}>
          {type === "clothing" ? "Clothing item" : "Outfit"}
        </AppText>
        <View style={styles.headerActions}>
          <Pressable onPress={handleEdit} hitSlop={10}>
            <FontAwesome5 name="pencil-alt" size={15} color={colors.ink} />
          </Pressable>
          <Pressable onPress={handleDelete} hitSlop={10}>
            <FontAwesome5 name="trash" size={15} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>

      <View style={styles.body}>
        <Pressable onPress={pickImage} style={styles.frame}>
          <Image
            source={{
              uri: type === "clothing" ? clothing.imageUrl : outfit.imageUrl,
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.replaceHint}>
            <FontAwesome5 name="camera" size={12} color={colors.paper} />
          </View>
        </Pressable>

        <View style={styles.card}>
          {type === "clothing" ? (
            <>
              <AttributeRow
                label="Colour"
                isLast={false}
                rightContent={
                  clothing.colour ? (
                    <View style={styles.colourValue}>
                      <View
                        style={[
                          styles.swatch,
                          { backgroundColor: colourHex },
                          needsSwatchBorder && styles.swatchBordered,
                        ]}
                      />
                      <AppText weight="medium" style={styles.value}>
                        {clothing.colour}
                      </AppText>
                    </View>
                  ) : undefined
                }
                value={!clothing.colour ? "—" : undefined}
              />
              <AttributeRow label="Brand" value={clothing.brand} />
              <AttributeRow label="Material" value={clothing.material} />
              <AttributeRow label="Season" value={clothing.season} />
              <AttributeRow label="Type" value={clothing.type} />
              <AttributeRow
                label="Indoor / Outdoor"
                value={clothing.inOut}
                isLast
              />
            </>
          ) : (
            <>
              <AttributeRow label="Style" value={outfit.style} />
              <AttributeRow label="Season" value={outfit.season} />
              <AttributeRow label="Occasion" value={outfit.occasion} isLast />
            </>
          )}
        </View>

        {type === "outfit" ? (
          <View style={styles.fieldGroup}>
            <AppText weight="medium" style={styles.fieldLabel}>
              Associated clothing
            </AppText>
            <View style={styles.clothingRow}>
              {(outfit.clothingItems ?? []).length === 0 ? (
                <AppText style={styles.fallbackText}>
                  No clothing linked yet
                </AppText>
              ) : (
                (outfit.clothingItems ?? []).map((clothingItem) => (
                  <Image
                    key={clothingItem.cid}
                    source={{ uri: clothingItem.imageUrl }}
                    style={styles.clothingThumb}
                  />
                ))
              )}
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default Item;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  headerActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  frame: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  replaceHint: {
    position: "absolute",
    bottom: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(43, 42, 40, 0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
  },
  colourValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 2,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  swatchBordered: {
    borderWidth: 1,
    borderColor: colors.line,
  },
  value: {
    fontSize: 14,
    color: colors.textMuted,
    textTransform: "capitalize",
  },
  fieldGroup: {
    gap: spacing.xs + 2,
  },
  fieldLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
  clothingRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs + 2,
  },
  clothingThumb: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
  },
  fallbackText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
