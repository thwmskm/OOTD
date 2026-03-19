import { StyleSheet, View, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import useClothingStore from "../../../services/stores/clothingStore";

const COLOUR_LIST = [
  "black",
  "white",
  "grey",
  "brown",
  "beige",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
];

const Colour = () => {
  const router = useRouter();
  const setClothing = useClothingStore((state) => state.setClothing);

  const colourPick = (colour) => {
    if (colour) {
      setClothing("colour", colour);
      router.back();
    } else {
      console.log("Error while picking colour!");
    }
  };

  return (
    <View>
      {COLOUR_LIST.map((colour) => (
        <Pressable
          key={colour}
          onPress={() => colourPick(colour)}
          style={styles.items}
        >
          <View style={[styles.swatch, { backgroundColor: colour }]}></View>
          <Text>{colour}</Text>
        </Pressable>
      ))}
    </View>
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
