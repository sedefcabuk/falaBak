// Design tokens for FalaBak, matched to the provided Figma reference:
// a deep navy canvas, rounded cards, and a blue → violet → pink accent
// family that also drives the Yaşam Dengesi bars.

export const colors = {
  bg: "#0F1220",
  bgElevated: "#171B2E",
  bgDeep: "#0A0C16",
  card: "#1B2036",
  cardAlt: "#212745",

  primary: "#3B6EF6",
  primaryDim: "#2549B0",
  violet: "#8A4FFF",
  pink: "#E84F8B",
  gold: "#FFC94A",
  goldSoft: "#FFE1A3",
  orange: "#FF8A5B",

  textPrimary: "#F5F6FA",
  textSecondary: "#9CA3C4",
  textMuted: "#6B7396",

  onColor: "#FFFFFF",

  border: "rgba(245, 246, 250, 0.07)",
  borderStrong: "rgba(245, 246, 250, 0.14)",

  success: "#4FD1A5",
  danger: "#E85B5B",
} as const;

export const gradients = {
  quoteCard: ["#6B4FE0", "#3B3FA8"] as const,
  promoCard: ["#3B6EF6", "#1E3A9E"] as const,
};

// Per-fortune-type accent, used for the icon roundel on the home grid.
export const fortuneAccents: Record<string, string> = {
  "kahve-fali": "#C97B3D",
  "yuz-fali": "#E8809B",
  "tarot-fali": "#8A4FFF",
  "el-fali": "#3B6EF6",
  "melek-kartlari": "#F2B25C",
  "duru-goru": "#8A4FFF",
};

export const activityAccents: Record<string, string> = {
  "sans-kurabiyesi": "#E8809B",
  eglence: "#FFC94A",
  carkifelek: "#4FC9D1",
  "salla-kazan": "#8A4FFF",
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontSize: 22,
    fontWeight: "700" as const,
    letterSpacing: 0.1,
    color: colors.textPrimary,
  },
  script: {
    fontSize: 22,
    fontWeight: "600" as const,
    fontStyle: "italic" as const,
    color: colors.textPrimary,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: colors.textMuted,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: colors.textSecondary,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  },
};

const theme = { colors, gradients, fortuneAccents, activityAccents, spacing, radius, typography };

export default theme;