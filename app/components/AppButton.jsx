// app/components/AppButton.jsx
import { Pressable, StyleSheet } from "react-native";
import AppText from "./AppText";
import { colors, spacing, radius } from "../../constants/theme";

const VARIANTS = {
  primary: {
    background: colors.sage,
    text: colors.paper,
  },
  secondary: {
    background: colors.surface,
    text: colors.ink,
  },
  ghost: {
    background: "transparent",
    text: colors.ink,
  },
};

/**
 * @param {{
 *   title: string,
 *   onPress: () => void,
 *   variant?: "primary" | "secondary" | "ghost",
 *   disabled?: boolean,
 *   style?: import("react-native").ViewStyle | import("react-native").ViewStyle[],
 * }} props
 */
const AppButton = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}) => {
  const { background, text } = VARIANTS[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: background,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        variant === "ghost" && styles.ghostBorder,
        style,
      ]}
    >
      <AppText weight="medium" style={{ color: text, fontSize: 15 }}>
        {title}
      </AppText>
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostBorder: {
    borderWidth: 1,
    borderColor: colors.line,
  },
});
