import { create } from "zustand";

export type OOTD = {
    imageUrl: string;
    caption: string;
};

//Define the ootdStore
type ootdStore = {
  ootd: OOTD;
  resetOotdStore: () => void;
  setOotd: <K extends keyof OOTD>(field: K, value: OOTD[K]) => void;
  loadOotd: (ootd: OOTD) => void;
};

//Create store for ootd
const useOOTDStore = create<ootdStore>((set) => ({
  ootd: {
    imageUrl: "",
    caption: "",
  },

  //Reset the store for new ootd
  resetOotdStore: () =>
    set(() => ({
      ootd: {
        imageUrl: "",
        caption: "",
      },
    })),

  //update ootd attributes
  setOotd: (field, value) =>
    set((state) => ({
      ootd: {
        ...state.ootd,
        [field]: value,
      },
    })),

  //load preexisting ootd object attributes
  loadOotd: (ootd) =>
    set(() => ({
      ootd: { ...ootd },
    })),
}));

export default useOOTDStore;

