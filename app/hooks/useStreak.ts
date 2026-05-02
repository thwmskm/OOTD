import { updateUser, getUser } from "../../services/userService";
import { useCallback, useEffect } from "react";

export type OOTDDayState =
  | 'never_posted'
  | 'posted_today'
  | 'not_posted_today'
  | 'streak_broken';

type StreakCheckResult = {
  dayState: OOTDDayState;
  streak: number;
  MaxStreak: number;
};

const useStreak = (uid: string) => {
  const checkStreak = useCallback(async (): Promise<StreakCheckResult | null> => {
    const userData = await getUser(uid);
    if (!userData) return null;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const { lastPostDate: rawLastPostDate, streak, MaxStreak = 0 } = userData;
    const lastPostDate = rawLastPostDate ? new Date(rawLastPostDate) : null;

    const isToday = lastPostDate?.toDateString() === today.toDateString();
    const isYesterday = lastPostDate?.toDateString() === yesterday.toDateString();

    let dayState: OOTDDayState;
    if (!lastPostDate)    dayState = 'never_posted';
    else if (isToday)     dayState = 'posted_today';
    else if (isYesterday) dayState = 'not_posted_today';
    else                  dayState = 'streak_broken';

    return { dayState, streak, MaxStreak };
  }, [uid]);

  const updateStreak = useCallback(async (): Promise<void> => {
    const userData = await getUser(uid);
    if (!userData) return;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const { lastPostDate: rawLastPostDate, streak, MaxStreak = 0 } = userData;
    const lastPostDate = rawLastPostDate ? new Date(rawLastPostDate) : null;

    if (lastPostDate?.toDateString() === today.toDateString()) return;

    let newStreak: number;
    if (!lastPostDate)                                                  newStreak = 1;
    else if (lastPostDate.toDateString() === yesterday.toDateString()) newStreak = streak + 1;
    else                                                                newStreak = 1;

    await updateUser(uid, {
      streak: newStreak,
      lastPostDate: today,
      MaxStreak: Math.max(newStreak, MaxStreak)
    });
  }, [uid]);

  return { checkStreak, updateStreak };
};

export default useStreak;