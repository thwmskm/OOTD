import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../database/firebase";
import { OOTD } from "../../models/OOTD";
import useUserStore from "../../services/stores/userStore";

const useWeeklyStrip = () => {
  const user = useUserStore((state) => state.user);
  const [weekStrip, setWeekStrip] = useState<(OOTD | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.uid) return;

    const fetchWeek = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const dayOfWeek = now.getDay();

        const sunday = new Date(now);
        sunday.setDate(now.getDate() - dayOfWeek);

        const toDateString = (d: Date) =>
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

        const sundayString = toDateString(sunday);
        const saturdayString = toDateString(new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + 6));

        const q = query(
          collection(db, "ootds"),
          where("uid", "==", user.uid),
          where("date", ">=", sundayString),
          where("date", "<=", saturdayString)
        );

        const snapshot = await getDocs(q);
        const fetchedMap: Record<string, OOTD> = {};
        snapshot.docs.forEach((doc) => {
          const data = doc.data() as OOTD;
          fetchedMap[data.date] = data;
        });

        const week: (OOTD | null)[] = Array.from({ length: 7 }, (_, i) => {
          const day = new Date(sunday);
          day.setDate(sunday.getDate() + i);
          return fetchedMap[toDateString(day)] ?? null;
        });

        setWeekStrip(week);
      } catch (error) {
        console.error("Error fetching weekly strip:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeek();
  }, [user.uid]);

  return { weekStrip, loading };
};

export default useWeeklyStrip;