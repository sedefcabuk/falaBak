import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, spacing } from "../theme/theme";
import type { LifeBalanceItem } from "../types/data";

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  physical: "barbell",
  emotional: "heart",
  mental: "bulb",
};

interface LifeBalanceCardProps {
  item: LifeBalanceItem;
}

export default function LifeBalanceCard({ item }: LifeBalanceCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: item.color }]}>
      <View style={styles.iconWrap}>
        <Ionicons name={ICONS[item.id] ?? "star"} size={14} color="#FFFFFF" />
      </View>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.sublabel}>{item.sublabel}</Text>
      <Text style={styles.value}>%{item.value}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${item.value}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: 4,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sublabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "rgba(255,255,255,0.75)",
  },
  value: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 2,
  },
  track: {
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
    marginTop: 4,
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: "#FFFFFF",
  },
});