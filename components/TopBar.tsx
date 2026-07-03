import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../theme/theme";

interface TopBarProps {
  mode?: "home" | "tarot";
  coinBalance: number;
  onBack?: () => void;
}

export default function TopBar({ mode = "home", coinBalance, onBack }: TopBarProps) {
  return (
    <View style={styles.row}>
      {mode === "home" ? (
        <>
          <Pressable style={styles.iconButton} hitSlop={8}>
            <Ionicons name="notifications" size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.logo}>FalaBak</Text>
        </>
      ) : (
        <>
          <Pressable style={styles.iconButton} onPress={onBack} hitSlop={8}>
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.script}>Tarot Falı</Text>
        </>
      )}

      <View style={styles.coinPill}>
        <View style={styles.coinDot}>
          <Ionicons name="disc" size={12} color={colors.bgDeep} />
        </View>
        <Text style={styles.coinText}>{coinBalance}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.bgElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    ...typography.title,
    fontSize: 18,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  script: {
    ...typography.script,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  coinPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  coinDot: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  coinText: {
    ...typography.subtitle,
    fontSize: 13,
    color: colors.textPrimary,
  },
});