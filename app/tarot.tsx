import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import rawData from "../data/falabak-data.json";
import TopBar from "../components/TopBar";
import TarotCard from "../components/TarotCard";
import { colors, radius, spacing, typography } from "../theme/theme";
import type { FalaBakData, TarotCardData, TarotPick } from "../types/data";

const data = rawData as FalaBakData;
const { tarotReading, tarotCards, user } = data;
const POSITIONS = tarotReading.spread.positions; // past, present, future

export default function TarotScreen() {
  const router = useRouter();
  const [picks, setPicks] = useState<TarotPick[]>([]);

  const usedIds = useMemo(() => new Set(picks.map((p) => p.cardId)), [picks]);
  const isComplete = picks.length >= POSITIONS.length;

  const handlePickCard = (card: TarotCardData) => {
    if (isComplete || usedIds.has(card.id)) return;
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
  };

  const cardById = (id: string) => tarotCards.find((c) => c.id === id);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <TopBar mode="tarot" coinBalance={user.coinBalance} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Three slots */}
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

        {/* Reveal panel once all slots are filled */}
        {isComplete && (
          <View style={styles.revealPanel}>
            {picks.map((pick) => {
              const card = cardById(pick.cardId);
              if (!card) return null;
              const position = POSITIONS[pick.positionIndex];
              const meaning = pick.reversed ? card.reversedMeaning : card.uprightMeaning;
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

        {/* Deck / fan */}
        <View style={styles.deckSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fanRow}
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
                  style={{
                    marginLeft: index === 0 ? 0 : -32,
                    transform: [{ rotate: `${rotate}deg` }],
                  }}
                />
              );
            })}
          </ScrollView>

          <View style={styles.footerRow}>
            <Text style={styles.progressLabel}>{picks.length}/3 kart seçildi</Text>
            <Pressable onPress={handleReset} hitSlop={8}>
              <Text style={styles.resetLabel}>Tekrar çek / sıfırla</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.lg },
  slotsRow: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm, marginTop: spacing.md },
  pickLabel: { ...typography.title, textAlign: "center" },
  revealPanel: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.md, gap: spacing.md },
  revealItem: { gap: 4 },
  revealPosition: { ...typography.subtitle, color: colors.gold },
  revealOrientation: { color: colors.textMuted, fontWeight: "400" },
  revealMeaning: { ...typography.body },
  deckSection: { gap: spacing.sm },
  fanRow: { paddingVertical: spacing.md, paddingLeft: spacing.md, paddingRight: spacing.xl, alignItems: "center" },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressLabel: { ...typography.caption },
  resetLabel: { ...typography.caption, color: colors.primary, fontWeight: "700" },
});