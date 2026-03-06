import { create } from "zustand";

//Outfit item structure
export type Outfit = {
  oid: string | null;
  uid: string | null;
  imageUrl: string;
  colour: string;
  style: string;
  occasion: string;
  season: "Spring" | "Summer" | "Autumn" | "Winter";
  clothingItems: string[];
  favourite: boolean;
};

//Define the OutfitStore
type OutfitStore = {
  outfit: Outfit;
  resetOutfitStore: () => void;
  setOutfit: <K extends keyof Outfit>(field: K, value: Outfit[K]) => void;
  loadOutfit: (outfit: Outfit) => void;
};

//Create store for outfit
const useOutfitStore = create<OutfitStore>((set) => ({
  outfit: {
    oid: null,
    uid: null,
    imageUrl: "",
    colour: "",
    style: "",
    occasion: "",
    season: "Spring",
    clothingItems: [],
    favourite: false,
  },

  //Reset the store for new outfit
  resetOutfitStore: () =>
    set(() => ({
      outfit: {
        oid: null,
        uid: null,
        imageUrl: "",
        colour: "",
        style: "",
        occasion: "",
        season: "Spring",
        clothingItems: [],
        favourite: false,
      },
    })),

  //update outfit attributes
  setOutfit: (field, value) =>
    set((state) => ({
      outfit: {
        ...state.outfit,
        [field]: value,
      },
    })),

  //load preexisting outfit object attributes
  loadOutfit: (outfit) =>
    set(() => ({
      outfit: { ...outfit },
    })),
}));

export default useOutfitStore;
