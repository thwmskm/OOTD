import { useRouter } from "expo-router";
import useClothingStore from "../../../services/stores/clothingStore";
import PickerList from "../../components/PickerList";

const TYPE_LIST = ["Top", "Bottom", "One piece", "Shoes", "Hat", "Accessory"];

const Type = () => {
  const router = useRouter();
  const clothing = useClothingStore((state) => state.clothing);
  const setClothing = useClothingStore((state) => state.setClothing);

  const typePick = (type) => {
    setClothing("type", type);
    router.back();
  };

  return (
    <PickerList
      title="Clothing type"
      options={TYPE_LIST}
      selectedValue={clothing.type}
      onSelect={typePick}
      onBack={() => router.back()}
    />
  );
};

export default Type;
