import { StyleSheet, View, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import useClothingStore from "../../../services/stores/clothingStore";

const TYPE_LIST = ["Top", "Bottom", "One piece", "Shoes", "Hat", "Accessory"];

const Type = () => {
  const router = useRouter();
  const setClothing = useClothingStore((state) => state.setClothing);

  const typePick = (type) => {
    if (type) {
      setClothing("type", type);
      router.back();
    } else {
      console.log("Error while picking type!");
    }
  };

  return (
    <View>
      {TYPE_LIST.map((type) => (
        <Pressable
          key={type}
          onPress={() => typePick(type)}
          style={styles.items}
        >
          <Text>{type}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default Type;

const styles = StyleSheet.create({
  items: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 5,
  },
});
