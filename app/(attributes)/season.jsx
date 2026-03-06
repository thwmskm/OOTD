import { StyleSheet, View, Pressable, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import useClothingStore from "../../services/stores/clothingStore";
import useOutfitStore from "../../services/stores/outfitStore";

const SEASON_LIST = ["Spring", "Summer", "Autumn", "Winter", "All year"];

const Season = () => {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const setClothing = useClothingStore((state) => state.setClothing);
  const setOutfit = useOutfitStore((state) => state.setOutfit);

  const seasonPick = (season) => {
    if (type === "clothing") {
      if (season) {
        setClothing("season", season);
        router.back();
      } else {
        console.log("Error while picking season!");
      }
    } else {
      if (season) {
        setOutfit("season", season);
        router.back();
      } else {
        console.log("Error while picking season!");
      }
    }
  };

  return (
    <View>
      {SEASON_LIST.map((season) => (
        <Pressable
          key={season}
          onPress={() => seasonPick(season)}
          style={styles.items}
        >
          <Text>{season}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default Season;

const styles = StyleSheet.create({
  items: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 5,
  },
});
