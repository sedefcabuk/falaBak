import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import rawData from "../data/falabak-data.json";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import FortuneTypeCard from "../components/FortuneTypeCard";
import LifeBalanceCard from "../components/LifeBalanceCard";
import ActivityRow from "../components/ActivityRow";
import { useCountdown } from "../hooks/useCountdown";
import { colors, gradients, radius, spacing, typography } from "../theme/theme";
import type { Activity, FalaBakData, FortuneType, NavTab } from "../types/data";

const data = rawData as FalaBakData;

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("home");

  const { user, dailyQuote, promotion, fortuneTypes, lifeBalance, activities, navTabs } = data;

  const countdown = useCountdown(promotion.endsAt, promotion.countdownDurationSeconds);

  const handleFortunePress = (item: FortuneType) => {
    if (item.route === "tarot") {
      router.push("/tarot");
    }
  };

  const handleTabPress = (tab: NavTab) => {
    setActiveTab(tab.id);
  };

  const handleActivityPress = (_item: Activity) => {
    // Etkinlik akışları bu case study kapsamı dışında; ileride ilgili route'a yönlendirilebilir.
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <TopBar mode="home" coinBalance={user.coinBalance} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>
          Hoş Geldin, <Text style={styles.welcomeName}>{user.firstName}</Text>
        </Text>

        {/* Günün Sözü */}
        <LinearGradient
          colors={gradients.quoteCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quoteCard}
        >
          <View style={styles.quoteGlyph}>
            <Ionicons name="moon" size={18} color={colors.goldSoft} />
          </View>
          <Text style={styles.quoteText}>“{dailyQuote.text}”</Text>
          <Text style={styles.quoteAuthor}>{dailyQuote.author}</Text>
        </LinearGradient>

        {/* Promotion / Countdown */}
        <LinearGradient
          colors={gradients.promoCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.promoCard}
        >
          <View style={styles.promoRow}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>{promotion.badgeLabel}</Text>
            </View>
            <Text style={styles.promoTitle}>{promotion.title}</Text>
          </View>
          <Text
            style={[styles.countdownText, countdown.isExpired && styles.countdownExpired]}
          >
            {countdown.label}
          </Text>
        </LinearGradient>

        {/* Fal Türlerimiz */}
        <Section title="Fal Türlerimiz">
          <View style={styles.grid}>
            {fortuneTypes.map((item) => (
              <FortuneTypeCard key={item.id} item={item} onPress={handleFortunePress} />
            ))}
          </View>
        </Section>

        {/* Yaşam Dengesi */}
        <Section title={lifeBalance.title}>
          <View style={styles.balanceRow}>
            {lifeBalance.items.map((item) => (
              <LifeBalanceCard key={item.id} item={item} />
            ))}
          </View>
        </Section>

        {/* Etkinlikler */}
        <Section title="Etkinlikler">
          <View style={styles.activityList}>
            {activities.map((item) => (
              <ActivityRow key={item.id} item={item} onPress={handleActivityPress} />
            ))}
          </View>
          <View style={styles.viewAllButton}>
            <Text style={styles.viewAllLabel}>Hepsini Görüntüle</Text>
          </View>
        </Section>
      </ScrollView>

      <BottomNav tabs={navTabs} activeId={activeTab} onSelect={handleTabPress} />
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  welcome: {
    ...typography.display,
    marginTop: spacing.xs,
  },
  welcomeName: {
    color: colors.textPrimary,
  },
  quoteCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  quoteGlyph: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  quoteText: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 15,
  },
  quoteAuthor: {
    ...typography.caption,
    color: "rgba(245,246,250,0.7)",
  },
  promoCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  promoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  promoBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  promoBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.onColor,
  },
  promoTitle: {
    ...typography.title,
    color: colors.onColor,
    fontSize: 16,
  },
  countdownText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
    color: colors.onColor,
    fontVariant: ["tabular-nums"],
  },
  countdownExpired: {
    color: "rgba(255,255,255,0.85)",
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 17,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  balanceRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  activityList: {
    gap: spacing.sm,
  },
  viewAllButton: {
    marginTop: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  viewAllLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.onColor,
  },
});