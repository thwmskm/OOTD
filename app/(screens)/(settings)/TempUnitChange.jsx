import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Pressable, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useUserStore from "../../../services/stores/userStore";
import { updateUserPreferences } from "../../../services/userService";
import AppText from "../../components/AppText";
import { colors, spacing, radius } from "../../../constants/theme";

const UNIT_LIST = [
  { value: "C", label: "Celsius (°C)" },
  { value: "F", label: "Fahrenheit (°F)" },
];

//temperature unit preference: Celsius or Fahrenheit
const TempUnitChange = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setPreference = useUserStore((state) => state.setPreference);
  const { tempUnit } = user.preferences;

  //blocks taps while a write is in flight so a failed write can't revert to a stale value
  const [saving, setSaving] = useState(false);

  const handlePick = async (unit) => {
    if (!user.uid || saving || unit === tempUnit) return;

    const previous = tempUnit;

    //1. update the store first so the UI responds immediately
    setPreference("tempUnit", unit);
    setSaving(true);

    //2. then write to Firestore
    try {
      await updateUserPreferences(user.uid, { tempUnit: unit });
    } catch (error) {
      //3. on failure, revert the store and tell the user
      setPreference("tempUnit", previous);
      Alert.alert(
        "Couldn't save",
        "Your temperature unit wasn't updated. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <FontAwesome5 name="arrow-left" size={20} color={colors.ink} />
        </Pressable>
        <AppText weight="bold" style={styles.headerTitle}>
          Temperature Unit Preference
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        <View style={styles.sections}>
          {UNIT_LIST.map(({ value, label }, index) => (
            <Pressable
              key={value}
              onPress={() => handlePick(value)}
              disabled={saving}
              style={[
                styles.row,
                index === UNIT_LIST.length - 1 && styles.rowLast,
              ]}
            >
              <AppText weight="regular" style={styles.rowLabel}>
                {label}
              </AppText>
              {tempUnit === value && (
                <FontAwesome5 name="check" size={14} color={colors.ink} />
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TempUnitChange;

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
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sections: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    height: 48,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.ink,
  },
});
