import { updateUser } from "../../services/userService";
import { useCallback } from "react";
import { OOTDDayState } from "../../services/stores/userStore";
import useUserStore from "../../services/stores/userStore";

type StreakCheckResult = {
  dayState: OOTDDayState;
  streak: number;
  MaxStreak: number;
};

const useStreak = () => {
  //iniitialze userStore
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  //Check Streak status and return streak data
  const checkStreak = useCallback((): StreakCheckResult => {
    const now = new Date();
    const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayString = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    const { lastPostDate, streak, MaxStreak } = user;

    let dayState: OOTDDayState;
    if (!lastPostDate)                        dayState = 'never_posted';
    else if (lastPostDate === todayString)     dayState = 'posted_today';
    else if (lastPostDate === yesterdayString) dayState = 'not_posted_today';
    else                                       dayState = 'streak_broken';

    return { dayState, streak, MaxStreak };
  }, [user]);

  //Update the streak
  const updateStreak = useCallback(async (): Promise<void> => {
    const now = new Date();
    const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayString = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    const { lastPostDate, streak, MaxStreak, uid } = user;

    if (lastPostDate === todayString) return;

    let newStreak: number;
    if (!lastPostDate)                        newStreak = 1;
    else if (lastPostDate === yesterdayString) newStreak = streak + 1;
    else                                       newStreak = 1;

    const updatedFields = {
      streak: newStreak,
      lastPostDate: todayString,
      MaxStreak: Math.max(newStreak, MaxStreak),
    };

    await updateUser(uid!, updatedFields);

    // sync store with updated values
    setUser("streak", updatedFields.streak);
    setUser("lastPostDate", updatedFields.lastPostDate);
    setUser("MaxStreak", updatedFields.MaxStreak);
  }, [user]);

  return { checkStreak, updateStreak };
};

export default useStreak;