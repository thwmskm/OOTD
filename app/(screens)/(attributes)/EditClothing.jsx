import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Pressable,
  TextInput,
  View,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import AttributeRow from "../../components/AttributeRow";
import { colors, spacing, radius } from "../../../constants/theme";

const EditClothing = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { imageUrl, cid } = useLocalSearchParams();

  const clothing = useClothingStore((state) => state.clothing);
  const loadClothing = useClothingStore((state) => state.loadClothing);
  const setClothing = useClothingStore((state) => state.setClothing);
  const resetClothingStore = useClothingStore(
    (state) => state.resetClothingStore,
  );

  const [loadStatus, setLoadStatus] = useState(true);
  const [originalBrand, setOriginalBrand] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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
            setOriginalBrand(data.brand ?? null);
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

  const save = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);

    try {
      if (clothing.cid) {
        await updateClothing(clothing.cid, clothing);

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
        router.back();
      } else {
        const newCid = uuid.v4().toString();
        const downloadUrl = await storeClothingItem(imageUrl, newCid, user.uid);

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

        await createClothing(newClothing);
        if (clothing.brand) {
          await incrementStatCount(user.uid, "brandCounts", clothing.brand);
        }
        await incrementTotalItems(user.uid);

        resetClothingStore();
        router.replace("/(tabs)/closet");
      }
    } catch (error) {
      console.error("Error trying to save clothing", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const isFavourite = () => {
    setClothing("favourite", !clothing.favourite);
  };

  const colourHex =
    COLOURS.find((c) => c.label === clothing.colour)?.hex ?? colors.line;
  const needsSwatchBorder = ["white", "cream", "silver", "beige"].includes(
    clothing.colour,
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <FontAwesome5 name="arrow-left" size={18} color={colors.ink} />
        </Pressable>
        <AppText weight="medium" style={styles.headerTitle}>
          {clothing.cid ? "Edit item" : "New item"}
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.frame}>
          {loadStatus ? (
            <View style={styles.imageFallback}>
              <AppText style={styles.fallbackText}>Loading...</AppText>
            </View>
          ) : clothing.imageUrl ? (
            <Image
              source={{ uri: clothing.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imageFallback}>
              <AppText style={styles.fallbackText}>No image found</AppText>
            </View>
          )}

          <Pressable
            onPress={isFavourite}
            style={styles.favouriteBtn}
            hitSlop={10}
          >
            <FontAwesome5
              size={16}
              name="heart"
              solid={clothing.favourite}
              color={clothing.favourite ? colors.blush : colors.paper}
            />
          </Pressable>
        </View>

        <View style={styles.card}>
          <AttributeRow
            label="Colour"
            onPress={() => router.push("/colour")}
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
                  <AppText weight="medium" style={styles.colourLabel}>
                    {clothing.colour}
                  </AppText>
                </View>
              ) : (
                <AppText weight="medium" style={styles.emptyValue}>
                  —
                </AppText>
              )
            }
          />
          <AttributeRow
            label="Season"
            value={clothing.season}
            onPress={() =>
              router.push({ pathname: "/season", params: { type: "clothing" } })
            }
          />
          <AttributeRow
            label="Type"
            value={clothing.type}
            onPress={() => router.push("/type")}
          />
          <AttributeRow
            label="Indoor / Outdoor"
            value={clothing.inOut}
            onPress={() => router.push("/inOut")}
            isLast
          />
        </View>

        <View style={styles.fieldGroup}>
          <AppText weight="medium" style={styles.fieldLabel}>
            Brand
          </AppText>
          <TextInput
            onChangeText={(text) => setClothing("brand", text)}
            value={clothing.brand}
            placeholder="Enter brand"
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
          />
        </View>

        <View style={styles.fieldGroup}>
          <AppText weight="medium" style={styles.fieldLabel}>
            Material
          </AppText>
          <TextInput
            onChangeText={(text) => setClothing("material", text)}
            value={clothing.material}
            placeholder="Enter material"
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
          />
        </View>

        <AppButton
          title={isSaving ? "Saving..." : "Save"}
          onPress={save}
          disabled={isSaving}
          style={styles.saveBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditClothing;

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
  body: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
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
  imageFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  favouriteBtn: {
    position: "absolute",
    top: spacing.sm,
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
  colourLabel: {
    fontSize: 14,
    color: colors.textMuted,
    textTransform: "capitalize",
  },
  emptyValue: {
    fontSize: 14,
    color: colors.textMuted,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.ink,
    fontFamily: "Pretendard_Regular",
  },
  saveBtn: {
    marginTop: spacing.sm,
  },
});
