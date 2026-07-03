import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "../theme/theme";
import type { NavTab } from "../types/data";

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: "home",
  compass: "compass",
  send: "paper-plane",
  moon: "moon",
  user: "person",
};

interface BottomNavProps {
  tabs: NavTab[];
  activeId: string;
  onSelect?: (tab: NavTab) => void;
}

export default function BottomNav({ tabs, activeId, onSelect }: BottomNavProps) {
  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        const iconName = ICONS[tab.icon] ?? "ellipse";
        return (
          <Pressable
            key={tab.id}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => onSelect?.(tab)}
            hitSlop={6}
          >
            <Ionicons
              name={active ? iconName : (`${iconName}-outline` as keyof typeof Ionicons.glyphMap)}
              size={19}
              color={active ? colors.onColor : colors.textMuted}
            />
            {active && <Text style={styles.label}>{tab.label}</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.onColor,
  },
});