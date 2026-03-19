import { StyleSheet, View, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import useClothingStore from "../../services/stores/clothingStore";

const INOUT_LIST = ["Indoor", "Outdoor"];

const InOut = () => {
  const router = useRouter();
  const setClothing = useClothingStore((state) => state.setClothing);

  const inOutPick = (inOut) => {
    if (inOut) {
      setClothing("inOut", inOut);
      router.back();
    } else {
      console.log("Error while picking inOut!");
    }
  };

  return (
    <View>
      {INOUT_LIST.map((inOut) => (
        <Pressable
          key={inOut}
          onPress={() => inOutPick(inOut)}
          style={styles.items}
        >
          <Text>{inOut}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default InOut;

const styles = StyleSheet.create({
  items: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 5,
  },
});
