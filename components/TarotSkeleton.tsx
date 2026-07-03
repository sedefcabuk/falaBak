import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Skeleton from "./Skeleton";
import { colors, radius, spacing } from "../theme/theme";

export default function TarotSkeleton() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.topRow}>
        <Skeleton width={36} height={36} borderRadius={999} />
        <Skeleton width={110} height={18} />
        <Skeleton width={64} height={28} borderRadius={999} />
      </View>

      <View style={styles.content}>
        <View style={styles.slotsRow}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width={98} height={142} borderRadius={radius.md} />
          ))}
        </View>
        <Skeleton width={120} height={20} style={styles.centered} />
        <View style={styles.fanRow}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              width={74}
              height={106}
              borderRadius={radius.md}
              style={i === 0 ? undefined : styles.overlap}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  slotsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  centered: {
    alignSelf: "center",
  },
  fanRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.md,
  },
  overlap: {
    marginLeft: -32,
  },
});