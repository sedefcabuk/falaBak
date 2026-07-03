import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../theme/theme";
import type { TarotCardData } from "../types/data";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = "empty" | "back" | "front";

interface TarotCardProps {
  card?: TarotCardData;
  label?: string;
  variant?: Variant;
  reversed?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export default function TarotCard({
  card,
  label,
  variant = "empty",
  reversed = false,
  disabled = false,
  onPress,
  style,
  width = 90,
  height = 130,
}: TarotCardProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(disabled ? 0.35 : 1, { duration: 200 }),
  }));

  if (variant === "empty") {
    return (
      <View style={[styles.slot, { width, height }, style]}>
        <Ionicons name="sparkles-outline" size={18} color={colors.textMuted} />
        {label ? <Text style={styles.slotLabel}>{label}</Text> : null}
      </View>
    );
  }

  if (variant === "back") {
    return (
      <AnimatedPressable
        style={[styles.back, { width, height }, animatedStyle, style]}
        onPress={onPress}
        disabled={disabled}
      >
        <View style={styles.backInner}>
          <Ionicons name="star" size={22} color={colors.primary} />
        </View>
      </AnimatedPressable>
    );
  }

  // variant === "front"
  return (
    <View style={[styles.frontWrap, { width }, style]}>
      <View style={[styles.front, { width, height }, reversed && styles.frontReversed]}>
        <Ionicons name="star" size={18} color={colors.gold} />
        <Text style={styles.frontName} numberOfLines={2}>
          {card?.name}
        </Text>
      </View>
      <Text style={styles.slotCaption}>{label}</Text>
      <Text style={styles.orientation}>{reversed ? "Ters" : "Düz"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgElevated,
    gap: 6,
  },
  slotLabel: {
    ...typography.caption,
    fontSize: 11,
  },
  slotCaption: {
    ...typography.caption,
    fontSize: 11,
    textAlign: "center",
    marginTop: spacing.xxs,
  },
  orientation: {
    ...typography.eyebrow,
    fontSize: 9,
    textAlign: "center",
  },
  back: {
    borderRadius: radius.md,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  backInner: {
    flex: 1,
    borderRadius: radius.md - 4,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },
  frontWrap: {
    alignItems: "center",
  },
  front: {
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xs,
    gap: 4,
  },
  frontReversed: {
    transform: [{ rotate: "180deg" }],
  },
  frontName: {
    ...typography.subtitle,
    fontSize: 11,
    textAlign: "center",
  },
});