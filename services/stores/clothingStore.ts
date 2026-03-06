import { create } from "zustand";

//Clothing item structure
export type Clothing = {
  cid: string | null;
  uid: string | null;
  imageUrl: string;
  colour: string;
  brand: string;
  material: string;
  season: "Spring" | "Summer" | "Autumn" | "Winter";
  type: "Top" | "Bottom" | "Outerwear" | "Shoes" | "Accessory"; // adjust as needed
  inOut: "Indoor" | "Outdoor";
  favourite: boolean;
};

//Define the clothingStore
type ClothingStore = {
  clothing: Clothing;
  resetClothingStore: () => void;
  setClothing: <K extends keyof Clothing>(field: K, value: Clothing[K]) => void;
  loadClothing: (clothing: Clothing) => void;
};

//Create store for clothing
const useClothingStore = create<ClothingStore>((set) => ({
  clothing: {
    cid: null,
    uid: null,
    imageUrl: "",
    colour: "",
    brand: "",
    material: "",
    season: "Spring",
    type: "Top",
    inOut: "Indoor",
    favourite: false,
  },

  //Reset the store for new clothing
  resetClothingStore: () =>
    set(() => ({
      clothing: {
        cid: null,
        uid: null,
        imageUrl: "",
        colour: "",
        brand: "",
        material: "",
        season: "Spring",
        type: "Top",
        inOut: "Indoor",
        favourite: false,
      },
    })),

  //update clothing attributes
  setClothing: (field, value) =>
    set((state) => ({
      clothing: {
        ...state.clothing,
        [field]: value,
      },
    })),

  //load preexisting clothing object attributes
  loadClothing: (clothing) =>
    set(() => ({
      clothing: { ...clothing },
    })),
}));

export default useClothingStore;
