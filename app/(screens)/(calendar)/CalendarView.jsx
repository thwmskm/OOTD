import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../database/firebase";
import useUserStore from "../../../services/stores/userStore";
import CalendarScroll from "../../components/CalendarScroll";
import AppText from "../../components/AppText";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, spacing } from "../../../constants/theme";

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
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.ink} />
        </Pressable>
        <AppText weight="bold" style={styles.headerTitle}>
          Calendar
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.container}>
        <CalendarScroll
          markedDates={markedDates}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
        />
      </View>
    </SafeAreaView>
  );
};

export default CalendarView;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 16,
    color: colors.ink,
  },
  headerSpacer: {
    width: 20,
  },
  container: {
    flex: 1,
  },
});
