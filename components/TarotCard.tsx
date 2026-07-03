import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  ZoomIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../theme/theme";
import type { TarotCardData } from "../types/data";

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
  /** Deck-only: fixed rotation (degrees) for the fan effect. */
  rotateDeg?: number;
  /** Deck-only: negative margin so cards overlap into a fan. */
  marginLeft?: number;
  /** Deck-only: staggered entrance delay in ms. */
  enterDelay?: number;
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
  rotateDeg = 0,
  marginLeft = 0,
  enterDelay = 0,
}: TarotCardProps) {
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
      <DeckCard
        disabled={disabled}
        onPress={onPress}
        width={width}
        height={height}
        rotateDeg={rotateDeg}
        marginLeft={marginLeft}
        enterDelay={enterDelay}
      />
    );
  }
  return (
    <Animated.View
      entering={ZoomIn.springify().damping(14)}
      style={[styles.frontWrap, { width }, style]}
    >
      <View style={[styles.front, { width, height }, reversed && styles.frontReversed]}>
        <Ionicons name="star" size={18} color={colors.gold} />
        <Text style={styles.frontName} numberOfLines={2}>
          {card?.name}
        </Text>
      </View>
      <Text style={styles.slotCaption}>{label}</Text>
      <Text style={styles.orientation}>{reversed ? "Ters" : "Düz"}</Text>
    </Animated.View>
  );
}

/**
 * Deck-back card. Tap to select, OR drag it upward (fan-physics) past a
 * small threshold to "pluck" it out — released early it springs back down.
 */
function DeckCard({
  disabled,
  onPress,
  width,
  height,
  rotateDeg,
  marginLeft,
  enterDelay,
}: {
  disabled?: boolean;
  onPress?: () => void;
  width: number;
  height: number;
  rotateDeg: number;
  marginLeft: number;
  enterDelay: number;
}) {
  const translateY = useSharedValue(0);

  const handlePress = () => {
    onPress?.();
  };

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .onEnd((_event, success) => {
      if (success) runOnJS(handlePress)();
    });

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .activeOffsetY([-8, 1000])
    .failOffsetX([-10, 10])
    .onUpdate((event) => {
      translateY.value = Math.min(0, event.translationY);
    })
    .onEnd((_event, success) => {
      if (success && translateY.value < -30) {
        runOnJS(handlePress)();
      }
      translateY.value = withSpring(0, { damping: 14 });
    });

  const composedGesture = Gesture.Race(pan, tap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotateDeg}deg` }],
    opacity: withTiming(disabled ? 0.3 : 1, { duration: 200 }),
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        entering={FadeIn.delay(enterDelay).springify().damping(16)}
        style={[styles.back, { width, height, marginLeft }, animatedStyle]}
      >
        <View style={styles.backInner}>
          <Ionicons name="star" size={22} color={colors.primary} />
        </View>
      </Animated.View>
    </GestureDetector>
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