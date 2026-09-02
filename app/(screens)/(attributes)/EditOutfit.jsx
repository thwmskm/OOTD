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
import { updateOutfit, createOutfit } from "../../../services/outfitService";
import useOutfitStore from "../../../services/stores/outfitStore";
import useUserStore from "../../../services/stores/userStore";
import { storeOutfit } from "../../../services/Storage";
import { FontAwesome5 } from "@expo/vector-icons";
import AppText from "../../components/AppText";
import AppButton from "../../components/AppButton";
import AttributeRow from "../../components/AttributeRow";
import { colors, spacing, radius } from "../../../constants/theme";

const EditOutfit = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { imageUrl, oid } = useLocalSearchParams();

  const outfit = useOutfitStore((state) => state.outfit);
  const loadOutfit = useOutfitStore((state) => state.loadOutfit);
  const setOutfit = useOutfitStore((state) => state.setOutfit);
  const resetOutfitStore = useOutfitStore((state) => state.resetOutfitStore);

  const [loadStatus, setLoadStatus] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initItem = async () => {
      setLoadStatus(true);
      resetOutfitStore();
      try {
        if (oid) {
          const snap = await getDoc(doc(db, "outfits", oid));
          if (snap.exists()) {
            const data = snap.data();
            loadOutfit(data);
          } else {
            console.log("No outfit found with oid:", oid);
          }
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

  const save = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);

    try {
      if (outfit.oid) {
        try {
          await updateOutfit(outfit.oid, outfit);
        } catch (error) {
          console.error("Error trying to update outfit", error);
          throw error;
        }
        router.back();
      } else {
        const newOid = uuid.v4().toString();
        const downloadUrl = await storeOutfit(imageUrl, newOid, user.uid);

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

        try {
          await createOutfit(newOutfit);
        } catch (error) {
          console.error("Error trying to create outfit", error);
          throw error;
        }
      }
      resetOutfitStore();
      router.replace("/(tabs)/closet");
    } finally {
      setIsSaving(false);
    }
  };

  const isFavourite = () => {
    setOutfit("favourite", !outfit.favourite);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <FontAwesome5 name="arrow-left" size={18} color={colors.ink} />
        </Pressable>
        <AppText weight="medium" style={styles.headerTitle}>
          {outfit.oid ? "Edit outfit" : "New outfit"}
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.frame}>
          {loadStatus ? (
            <View style={styles.imageFallback}>
              <AppText style={styles.fallbackText}>Loading...</AppText>
            </View>
          ) : outfit.imageUrl ? (
            <Image
              source={{ uri: outfit.imageUrl }}
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
              solid={outfit.favourite}
              color={outfit.favourite ? colors.blush : colors.paper}
            />
          </Pressable>
        </View>

        <View style={styles.fieldGroup}>
          <AppText weight="medium" style={styles.fieldLabel}>
            Style
          </AppText>
          <TextInput
            onChangeText={(text) => setOutfit("style", text)}
            value={outfit.style}
            placeholder="Enter style"
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
          />
        </View>

        <View style={styles.fieldGroup}>
          <AppText weight="medium" style={styles.fieldLabel}>
            Occasion
          </AppText>
          <TextInput
            onChangeText={(text) => setOutfit("occasion", text)}
            value={outfit.occasion}
            placeholder="Enter occasion"
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
          />
        </View>

        <View style={styles.card}>
          <AttributeRow
            label="Season"
            value={outfit.season}
            onPress={() =>
              router.push({ pathname: "/season", params: { type: "outfit" } })
            }
            isLast
          />
        </View>

        <View style={styles.fieldGroup}>
          <AppText weight="medium" style={styles.fieldLabel}>
            Associated clothing
          </AppText>
          <Pressable
            onPress={() => router.push({ pathname: "/linkClothing" })}
            style={styles.clothingRow}
          >
            {loadStatus ? (
              <AppText style={styles.fallbackText}>Loading...</AppText>
            ) : (
              <>
                {(outfit.clothingItems ?? []).map((item) => (
                  <Image
                    key={item.cid}
                    source={{ uri: item.imageUrl }}
                    style={styles.clothingThumb}
                  />
                ))}
                <View style={styles.addThumb}>
                  <FontAwesome5
                    name="plus"
                    size={18}
                    color={colors.textMuted}
                  />
                </View>
              </>
            )}
          </Pressable>
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

export default EditOutfit;

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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
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
  addThumb: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    marginTop: spacing.sm,
  },
});
