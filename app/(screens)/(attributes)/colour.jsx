import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import useClothingStore from "../../../services/stores/clothingStore";
import ColourPicker from "../../components/ColourPicker";
import AppText from "../../components/AppText";
import { colors, spacing } from "../../../constants/theme";

const Colour = () => {
  const router = useRouter();
  const setClothing = useClothingStore((state) => state.setClothing);
  const [colour, setColour] = useState(/** @type {string[]} */ ([]));

  const handlePick = (selected) => {
    setColour(selected);
    if (selected.length === 1) {
      setClothing("colour", selected[0]);
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <FontAwesome5 name="arrow-left" size={18} color={colors.ink} />
        </Pressable>
        <AppText weight="medium" style={styles.headerTitle}>
          Colour
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <ColourPicker selected={colour} onChange={handlePick} max={1} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Colour;

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
    paddingHorizontal: spacing.lg,
  },
});
