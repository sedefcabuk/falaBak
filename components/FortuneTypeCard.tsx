import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fortuneAccents, radius, spacing, typography } from "../theme/theme";
import type { FortuneType } from "../types/data";

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "coffee-cup": "cafe",
  "face-scan": "happy",
  "tarot-cards": "moon",
  palm: "hand-left",
  angel: "sparkles",
  "crystal-ball": "planet",
};

interface FortuneTypeCardProps {
  item: FortuneType;
  onPress?: (item: FortuneType) => void;
}

export default function FortuneTypeCard({ item, onPress }: FortuneTypeCardProps) {
  const accent = fortuneAccents[item.id] ?? colors.primary;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress?.(item)}
    >
      {item.badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      ) : null}
      <View style={[styles.iconWrap, { backgroundColor: accent }]}>
        <Ionicons name={ICONS[item.icon] ?? "sparkles"} size={22} color={colors.onColor} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: "31%",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: "center",
    gap: spacing.xs,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  badge: {
    position: "absolute",
    top: -10,
    alignSelf: "center",
    backgroundColor: colors.orange,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.onColor,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.subtitle,
    textAlign: "center",
    fontSize: 13,
  },
});