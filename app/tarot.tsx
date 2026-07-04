import { useEffect, useMemo, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import rawData from "../data/falabak-data.json";
import TopBar from "../components/TopBar";
import TarotCard from "../components/TarotCard";
import TarotSkeleton from "../components/TarotSkeleton";
import { useResponsive } from "../hooks/useResponsive";
import { useCoin } from "../contexts/CoinContext";
import { colors, radius, spacing, typography } from "../theme/theme";
import type { FalaBakData, TarotCardData, TarotPick } from "../types/data";

const data = rawData as FalaBakData;
const { tarotReading, tarotCards } = data;
const POSITIONS = tarotReading.spread.positions;

export default function TarotScreen() {
  const router = useRouter();
  const { balance, spend } = useCoin();
  const { contentMaxWidth, horizontalPadding } = useResponsive();
  const [picks, setPicks] = useState<TarotPick[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [deckWidths, setDeckWidths] = useState({ content: 0, visible: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const usedIds = useMemo(() => new Set(picks.map((p) => p.cardId)), [picks]);
  const isComplete = picks.length >= POSITIONS.length;

  const handlePickCard = (card: TarotCardData) => {
    if (isComplete || usedIds.has(card.id)) return;

    if (picks.length === 0) {
      const success = spend(tarotReading.cost);
      if (!success) {
        setInsufficientFunds(true);
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning,
        ).catch(() => {});
        return;
      }
      setInsufficientFunds(false);
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setPicks((prev) => [
      ...prev,
      {
        positionIndex: prev.length,
        cardId: card.id,
        reversed: Math.random() < 0.5,
      },
    ]);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setPicks([]);
    setInsufficientFunds(false);
  };

  const handleDeckScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const maxScroll = contentSize.width - layoutMeasurement.width;
    const progress = maxScroll > 0 ? contentOffset.x / maxScroll : 0;
    setScrollProgress(Math.min(1, Math.max(0, progress)));
  };

  const cardById = (id: string) => tarotCards.find((c) => c.id === id);

  if (isLoading) {
    return <TarotSkeleton />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <TopBar mode="tarot" coinBalance={balance} onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding,
            maxWidth: contentMaxWidth,
            alignSelf: "center",
            width: "100%",
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.slotsRow}>
          {POSITIONS.map((position) => {
            const pick = picks.find((p) => p.positionIndex === position.index);
            const card = pick ? cardById(pick.cardId) : undefined;
            return (
              <TarotCard
                key={position.id}
                label={position.label}
                variant={card ? "front" : "empty"}
                card={card}
                reversed={pick?.reversed}
                width={98}
                height={142}
              />
            );
          })}
        </View>

        <Text style={styles.pickLabel}>
          {isComplete ? "Açılım tamamlandı" : "Kart Seç"}
        </Text>

        {insufficientFunds && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Yeterli jetonun yok — Tarot Falı için {tarotReading.cost} jeton
              gerekiyor (bakiyen: {balance}).
            </Text>
          </View>
        )}

        {isComplete && (
          <View style={styles.revealPanel}>
            {picks.map((pick) => {
              const card = cardById(pick.cardId);
              if (!card) return null;
              const position = POSITIONS[pick.positionIndex];
              const meaning = pick.reversed
                ? card.reversedMeaning
                : card.uprightMeaning;
              return (
                <View key={pick.cardId} style={styles.revealItem}>
                  <Text style={styles.revealPosition}>
                    {position.label} — {card.name}{" "}
                    <Text style={styles.revealOrientation}>
                      ({pick.reversed ? "Ters" : "Düz"})
                    </Text>
                  </Text>
                  <Text style={styles.revealMeaning}>{meaning}</Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.deckSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fanRow}
            onScroll={handleDeckScroll}
            scrollEventThrottle={16}
            onLayout={(e) => {
              const width = e.nativeEvent.layout.width;
              setDeckWidths((prev) => ({ ...prev, visible: width }));
            }}
            onContentSizeChange={(w) =>
              setDeckWidths((prev) => ({ ...prev, content: w }))
            }
          >
            {tarotCards.map((card, index) => {
              const used = usedIds.has(card.id);
              const rotate = (index - tarotCards.length / 2) * 3;
              return (
                <TarotCard
                  key={card.id}
                  variant="back"
                  disabled={used || isComplete}
                  onPress={() => handlePickCard(card)}
                  width={74}
                  height={106}
                  rotateDeg={rotate}
                  marginLeft={index === 0 ? 0 : -32}
                  enterDelay={index * 35}
                />
              );
            })}
          </ScrollView>
          <View style={styles.footerRow}>
            <Text style={styles.progressLabel}>
              {picks.length}/3 kart seçildi
            </Text>
            <Pressable onPress={handleReset} hitSlop={8}>
              <Text style={styles.resetLabel}>Tekrar çek / sıfırla</Text>
            </Pressable>
          </View>
          {deckWidths.content > deckWidths.visible &&
            (() => {
              const R = deckWidths.visible * 1.2;
              const circleTopY = -0;
              const circleCenterY = circleTopY + R;
              const circleCenterX = deckWidths.visible / 2;
              const dx = (scrollProgress - 0.5) * deckWidths.visible * 0.9;
              const knobY =
                circleCenterY - Math.sqrt(Math.max(0, R * R - dx * dx));

              return (
                <View style={styles.arcWrap}>
                  <View
                    style={[
                      styles.arcCircle,
                      {
                        width: R * 2,
                        height: R * 2,
                        borderRadius: R,
                        left: circleCenterX - R,
                        top: circleTopY,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.arcKnob,
                      {
                        left: circleCenterX + dx - 6,
                        top: knobY,
                      },
                    ]}
                  />
                </View>
              );
            })()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  slotsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  pickLabel: {
    ...typography.title,
    textAlign: "center",
    fontWeight: 600,
  },
  warningBox: {
    backgroundColor: "rgba(232,91,91,0.12)",
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  warningText: {
    ...typography.body,
    color: colors.danger,
  },
  revealPanel: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  revealItem: {
    gap: 4,
  },
  revealPosition: {
    ...typography.subtitle,
    color: colors.gold,
  },
  revealOrientation: {
    color: colors.textMuted,
    fontWeight: "400",
  },
  revealMeaning: {
    ...typography.body,
  },
  deckSection: {
    gap: spacing.sm,
  },
  fanRow: {
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.xl,
    alignItems: "center",
  },
  arcWrap: {
    height: 40,
    overflow: "hidden",
    marginTop: 2,
  },
  arcCircle: {
    position: "absolute",
    borderWidth: 1.5,
    borderColor: colors.primary,
    opacity: 0.6,
  },
  arcKnob: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.onColor,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    ...typography.caption,
  },
  resetLabel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },
});
