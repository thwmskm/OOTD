// app/components/AppText.jsx
import { Text } from "react-native";
import { typography } from "../../constants/theme";

const WEIGHT_MAP = {
  regular: typography.regular,
  medium: typography.medium,
  bold: typography.bold,
};

/**
 * Drop-in replacement for RN's Text that applies Pretendard by default.
 * @param {{
 *   weight?: "regular" | "medium" | "bold",
 *   style?: import("react-native").TextStyle | import("react-native").TextStyle[],
 *   children?: React.ReactNode
 * } & import("react-native").TextProps} props
 */
const AppText = ({ weight = "regular", style, children, ...props }) => {
  return (
    <Text style={[{ fontFamily: WEIGHT_MAP[weight] }, style]} {...props}>
      {children}
    </Text>
  );
};

export default AppText;
