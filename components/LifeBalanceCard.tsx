import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius, spacing } from "../theme/theme";
import type { LifeBalanceItem } from "../types/data";

interface LifeBalanceCardProps {
  item: LifeBalanceItem;
}

export default function LifeBalanceCard({ item }: LifeBalanceCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: item.color }]}>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.sublabel}>{item.sublabel}</Text>
    <View style={styles.valueBox}>
      <Text style={styles.value}>%{item.value}</Text>
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
    alignItems:"center"
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
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 2,
  },
  valueBox: {
  marginTop: "auto",
  width: "70%",
  height: 30,
  borderRadius: 12,
  backgroundColor: "rgba(255,255,255,0.18)",
  alignItems: "center",
  justifyContent: "center",
},
  fill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: "#FFFFFF",
  },
});