export const colors = {
  paper: "#FAF7F1",
  ink: "#2B2A28",
  sage: "#8FA684",
  blush: "#F0B8A6",
  line: "#C9C2B8",
  surface: "#F3EEE6",
  textMuted: "#8B8578",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

export const typography = {
  regular: "Pretendard_Regular",
  medium: "Pretendard_Medium",
  bold: "Pretendard_Bold",
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 28,
} as const;

export type ThemeColor = keyof typeof colors;