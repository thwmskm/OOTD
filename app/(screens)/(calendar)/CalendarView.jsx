import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../database/firebase";
import useUserStore from "../../../services/stores/userStore";
import CalendarScroll from "../../components/CalendarScroll";

const CalendarView = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const cache = useRef({});
  const [markedDates, setMarkedDates] = useState({});

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const fetchMonth = useCallback(
    async (y, m) => {
      if (!user?.uid) return;

      const cacheKey = `${y}-${m}`;
      if (cache.current[cacheKey]) {
        setMarkedDates(cache.current[cacheKey]);
        return;
      }

      try {
        const pad = (n) => String(n).padStart(2, "0");
        const firstDay = `${y}-${pad(m)}-01`;
        const lastDay = `${y}-${pad(m)}-${pad(new Date(y, m, 0).getDate())}`;

        const q = query(
          collection(db, "ootds"),
          where("uid", "==", user.uid),
          where("date", ">=", firstDay),
          where("date", "<=", lastDay),
        );

        const snap = await getDocs(q);
        const marks = {};
        snap.forEach((doc) => {
          const date = doc.id.split("_")[1];
          marks[date] = { marked: true };
        });

        cache.current[cacheKey] = marks;
        setMarkedDates(marks);
      } catch (err) {
        console.error("Failed to fetch monthly OOTDs:", err);
      }
    },
    [user?.uid],
  );

  useEffect(() => {
    fetchMonth(year, month);
  }, []);

  const handleMonthChange = ({ year: y, month: m }) => {
    setYear(y);
    setMonth(m);
    fetchMonth(y, m);
  };

  const handleDayPress = (date) => {
    if (!markedDates[date.dateString]) return;
    router.push({
      pathname: "/OOTDDetails",
      params: { id: `${user.uid}_${date.dateString}` },
    });
  };

  return (
    <View style={styles.container}>
      <CalendarScroll
        markedDates={markedDates}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
      />
    </View>
  );
};

export default CalendarView;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
