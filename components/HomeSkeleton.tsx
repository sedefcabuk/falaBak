import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Skeleton from "./Skeleton";
import { colors, radius, spacing } from "../theme/theme";

export default function HomeSkeleton() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.topRow}>
        <Skeleton width={36} height={36} borderRadius={999} />
        <Skeleton width={90} height={18} />
        <Skeleton width={64} height={28} borderRadius={999} />
      </View>

      <View style={styles.content}>
        <Skeleton width={200} height={24} />
        <Skeleton width="100%" height={100} borderRadius={radius.lg} />
        <Skeleton width="100%" height={90} borderRadius={radius.lg} />

        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} width="31%" height={96} borderRadius={radius.lg} />
          ))}
        </View>

        <View style={styles.row}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width="100%" height={90} borderRadius={radius.lg} style={styles.flexItem} />
          ))}
        </View>

        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} width="100%" height={56} borderRadius={radius.lg} />
        ))}
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  flexItem: {
    flex: 1,
  },
});