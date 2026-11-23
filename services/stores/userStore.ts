import { create } from "zustand";
import type { TempUnit, UserPreferences } from "../../models/User";

export type { TempUnit, UserPreferences };

//Defaults applied to new users and to existing users whose doc has no preferences yet
export const DEFAULT_PREFERENCES: UserPreferences = {
  tempUnit: "C",
  savesEnabled: true,
};

export type User = {
    uid?: string;
    email: string;
    username: string;
    pfp?: string;
    streak: number;
    MaxStreak: number;
    lastPostDate: string | null;
    preferences: UserPreferences;
};

//A user as it may come from Firestore: older docs have no (or partial) preferences
type LoadableUser = Omit<User, "preferences"> & {
  preferences?: Partial<UserPreferences>;
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
  setPreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ) => void;
  loadUser: (user: LoadableUser) => void;
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
    preferences: { ...DEFAULT_PREFERENCES },
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
        preferences: { ...DEFAULT_PREFERENCES },
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

  //update a single preference without touching the others
  setPreference: (key, value) =>
    set((state) => ({
      user: {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          [key]: value,
        },
      },
    })),

  //load preexisting user object attributes (missing preferences fall back to defaults)
  loadUser: (user) =>
    set(() => ({
      user: {
        ...user,
        preferences: { ...DEFAULT_PREFERENCES, ...user.preferences },
      },
    })),
}));

export default useUserStore;