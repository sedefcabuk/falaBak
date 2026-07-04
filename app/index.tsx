import { useEffect, useState, type ReactNode } from "react";
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
import HomeSkeleton from "../components/HomeSkeleton";
import { useCountdown } from "../hooks/useCountdown";
import { useResponsive } from "../hooks/useResponsive";
import { useCoin } from "../contexts/CoinContext";
import { colors, gradients, radius, spacing, typography } from "../theme/theme";
import type { Activity, FalaBakData, FortuneType, NavTab } from "../types/data";

const data = rawData as FalaBakData;

export default function HomeScreen() {
  const router = useRouter();
  const { balance } = useCoin();
  const { columns, contentMaxWidth, horizontalPadding } = useResponsive();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isLoading, setIsLoading] = useState(true);

  const { dailyQuote, promotion, fortuneTypes, lifeBalance, activities, navTabs, user } = data;

  const countdown = useCountdown(promotion.endsAt, promotion.countdownDurationSeconds);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleFortunePress = (item: FortuneType) => {
    if (item.route === "tarot") {
      router.push("/tarot");
    }
  };

  const handleTabPress = (tab: NavTab) => {
    setActiveTab(tab.id);
  };

  const handleActivityPress = (_item: Activity) => {
    
  };

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <TopBar mode="home" coinBalance={balance} />

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
        <Text style={styles.welcome}>
          Hoş Geldin, <Text style={styles.welcomeName}>{user.name}</Text>
        </Text>

        <LinearGradient
          colors={gradients.quoteCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quoteCard}
        >
          <View style={styles.quoteGlyph}>
            <Ionicons name="moon" size={18} color={colors.goldSoft} />
          </View>
          <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
          <Text style={styles.quoteAuthor}>{dailyQuote.author}</Text>
        </LinearGradient>

        <LinearGradient
          colors={countdown.isExpired ? gradients.promoExpired : gradients.promoCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.promoCard}
        >
          {countdown.isExpired ? (
            <View style={styles.promoExpiredRow}>
              <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.promoExpiredText}>
                Bu kampanyanın süresi doldu — yeni fırsatlar yakında
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.promoRow}>
                <View style={styles.promoBadge}>
                  <Text style={styles.promoBadgeText}>{promotion.badgeLabel}</Text>
                </View>
                <Text style={styles.promoTitle}>{promotion.title}</Text>
              </View>
              <Text style={styles.countdownText}>{countdown.label}</Text>
            </>
          )}
        </LinearGradient>

        <Section title="Fal Türlerimiz">
          <View style={styles.grid}>
            {fortuneTypes.map((item) => (
              <FortuneTypeCard
                key={item.id}
                item={item}
                onPress={handleFortunePress}
                columns={columns}
              />
            ))}
          </View>
        </Section>

        <Section title={lifeBalance.title}>
          <View style={styles.balanceRow}>
            {lifeBalance.items.map((item) => (
              <LifeBalanceCard key={item.id} item={item} />
            ))}
          </View>
        </Section>

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
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  welcome: {
    ...typography.display,
    marginTop: spacing.xs,
    fontWeight: 300
  },
  welcomeName: {
    color: colors.textPrimary,
    fontWeight: 700
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
    fontWeight:800
  },
  promoCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    minHeight: 88,
    justifyContent: "center",
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
  promoExpiredRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  promoExpiredText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 17,
    fontWeight:400
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
    fontWeight: "500",
    color: colors.onColor,
  },
});