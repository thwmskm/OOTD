import { useRouter, useLocalSearchParams } from "expo-router";
import useClothingStore from "../../../services/stores/clothingStore";
import useOutfitStore from "../../../services/stores/outfitStore";
import PickerList from "../../components/PickerList";

const SEASON_LIST = ["Spring", "Summer", "Autumn", "Winter", "All year"];

const Season = () => {
  const router = useRouter();
  const { type } = useLocalSearchParams();

  const clothing = useClothingStore((state) => state.clothing);
  const setClothing = useClothingStore((state) => state.setClothing);
  const outfit = useOutfitStore((state) => state.outfit);
  const setOutfit = useOutfitStore((state) => state.setOutfit);

  const isClothing = type === "clothing";
  const currentSeason = isClothing ? clothing.season : outfit.season;

  const seasonPick = (season) => {
    if (isClothing) {
      setClothing("season", season);
    } else {
      setOutfit("season", season);
    }
    router.back();
  };

  return (
    <PickerList
      title="Season"
      options={SEASON_LIST}
      selectedValue={currentSeason}
      onSelect={seasonPick}
      onBack={() => router.back()}
    />
  );
};

export default Season;
