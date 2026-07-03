import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { activityAccents, colors, radius, spacing, typography } from "../theme/theme";
import type { Activity } from "../types/data";

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "fortune-cookie": "gift",
  sparkles: "sparkles",
  wheel: "sync",
  "shake-gift": "shuffle",
};

interface ActivityRowProps {
  item: Activity;
  onPress?: (item: Activity) => void;
}

export default function ActivityRow({ item, onPress }: ActivityRowProps) {
  const accent = activityAccents[item.id] ?? colors.primary;

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={() => onPress?.(item)}
    >
      <View style={styles.left}>
        <View style={[styles.iconWrap, { backgroundColor: accent }]}>
          <Ionicons name={ICONS[item.icon] ?? "sparkles"} size={17} color={colors.onColor} />
        </View>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  pressed: {
    opacity: 0.75,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.subtitle,
  },
});