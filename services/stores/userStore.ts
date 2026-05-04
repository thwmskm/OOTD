import { create } from "zustand";

export type User = {
    uid?: string;
    email: string;
    username: string;
    pfp?: string;
    streak: number;
    MaxStreak: number;
    lastPostDate: string | null;
};

export type OOTDDayState =
  | 'never_posted'
  | 'posted_today'
  | 'not_posted_today'
  | 'streak_broken';

//Define the userStore
type userStore = {
  user: User;
  resetUserStore: () => void;
  setUser: <K extends keyof User>(field: K, value: User[K]) => void;
  loadUser: (user: User) => void;
};

//Create store for user
const useUserStore = create<userStore>((set) => ({
  user: {
    uid: "",
    email: "",
    username: "",
    pfp: "",
    streak: 0,
    MaxStreak: 0,
    lastPostDate: null,
  },

  //Reset the store for new user
  resetUserStore: () =>
    set(() => ({
      user: {
        uid: "",
        email: "",
        username: "",
        pfp: "",
        streak: 0,
        MaxStreak: 0,
        lastPostDate: null,
      },
    })),

  //update user attributes
  setUser: (field, value) =>
    set((state) => ({
      user: {
        ...state.user,
        [field]: value,
      },
    })),

  //load preexisting user object attributes
  loadUser: (user) =>
    set(() => ({
      user: { ...user },
    })),
}));

export default useUserStore;