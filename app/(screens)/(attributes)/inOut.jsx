import { useRouter } from "expo-router";
import useClothingStore from "../../../services/stores/clothingStore";
import PickerList from "../../components/PickerList";

const INOUT_LIST = ["Indoor", "Outdoor"];

const InOut = () => {
  const router = useRouter();
  const clothing = useClothingStore((state) => state.clothing);
  const setClothing = useClothingStore((state) => state.setClothing);

  const inOutPick = (inOut) => {
    setClothing("inOut", inOut);
    router.back();
  };

  return (
    <PickerList
      title="Indoor / Outdoor"
      options={INOUT_LIST}
      selectedValue={clothing.inOut}
      onSelect={inOutPick}
      onBack={() => router.back()}
    />
  );
};

export default InOut;
