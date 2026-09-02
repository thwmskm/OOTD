import { StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import AppText from "./AppText";
import { colors, spacing } from "../../constants/theme";

/**
 * Shared full-screen picker: header with back button + title,
 * then a flat list of tappable options with a checkmark on the current selection.
 */
const PickerList = ({ title, options, selectedValue, onSelect, onBack }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12}>
          <FontAwesome5 name="arrow-left" size={18} color={colors.ink} />
        </Pressable>
        <AppText weight="medium" style={styles.headerTitle}>
          {title}
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.list}>
        {options.map((option, index) => {
          const isSelected = option === selectedValue;
          const isLast = index === options.length - 1;
          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={[styles.row, !isLast && styles.divider]}
            >
              <AppText
                weight={isSelected ? "medium" : "regular"}
                style={styles.label}
              >
                {option}
              </AppText>
              {isSelected && (
                <FontAwesome5 name="check" size={14} color={colors.sage} />
              )}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default PickerList;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  headerSpacer: {
    width: 18,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  label: {
    fontSize: 15,
    color: colors.ink,
  },
});
