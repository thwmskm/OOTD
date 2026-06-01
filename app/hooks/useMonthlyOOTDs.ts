//scrapped for later use
//vvvvvvvvvvvvvvvvvvvvvvvv
import { useState, useCallback, useRef } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../database/firebase";
import useUserStore from "../../services/stores/userStore";

const useMonthlyOOTDs = () => {
  const cache = useRef<Record<string, Record<string, object>>>({});
  const [markedDates, setMarkedDates] = useState<Record<string, object>>({});
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);

  const fetchMonth = useCallback(async (year: number, month: number) => {
    if (!user?.uid) return;

    const cacheKey = `${year}-${month}`;

    if (cache.current[cacheKey]) {
      setMarkedDates(cache.current[cacheKey]);
      return;
    }

    setLoading(true);
    try {
      const pad = (n: number) => String(n).padStart(2, "0");
      const firstDay = `${year}-${pad(month)}-01`;
      const lastDay = `${year}-${pad(month)}-${pad(new Date(year, month, 0).getDate())}`;

      const q = query(
        collection(db, "ootds"),
        where("uid", "==", user.uid),
        where("date", ">=", firstDay),
        where("date", "<=", lastDay)
      );

      const snap = await getDocs(q);
      const marks: Record<string, object> = {};
      snap.forEach((doc) => {
        marks[doc.data().date] = { marked: true };
      });

      cache.current[cacheKey] = marks;
      setMarkedDates(marks);
    } catch (err) {
      console.error("Failed to fetch monthly OOTDs:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  return { markedDates, loading, fetchMonth };
};

export default useMonthlyOOTDs;