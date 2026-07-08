import { StyleSheet, View, Pressable, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import useClothingStore from "../../../services/stores/clothingStore";
import ColourPicker from "../../components/ColourPicker";

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
    <ScrollView>
      <ColourPicker
        selected={colour}
        onChange={handlePick}
        max={1}
      ></ColourPicker>
    </ScrollView>
  );
};

export default Colour;

const styles = StyleSheet.create({
  items: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 5,
  },
  swatch: {
    borderRadius: 10,
    width: 20,
    height: 20,
    borderWidth: 1,
  },
});
