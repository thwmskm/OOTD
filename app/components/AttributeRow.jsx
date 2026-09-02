import { Pressable, View, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import AppText from "./AppText";
import { colors, spacing } from "../../constants/theme";

const AttributeRow = ({
  label,
  value,
  onPress,
  rightContent,
  isLast = false,
}) => {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={[styles.row, !isLast && styles.divider]}
    >
      <AppText weight="regular" style={styles.label}>
        {label}
      </AppText>
      <View style={styles.right}>
        {rightContent ?? (
          <AppText weight="medium" style={styles.value}>
            {value || "—"}
          </AppText>
        )}
        {onPress && (
          <FontAwesome5
            name="chevron-right"
            size={12}
            color={colors.textMuted}
          />
        )}
      </View>
    </Container>
  );
};

export default AttributeRow;

const styles = StyleSheet.create({
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
    fontSize: 14,
    color: colors.ink,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 2,
  },
  value: {
    fontSize: 14,
    color: colors.textMuted,
    textTransform: "capitalize",
  },
});
