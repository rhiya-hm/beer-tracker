import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";
import type { Beer } from "../types/beer";

function topStyle(beers: Beer[]): string | null {
  if (beers.length === 0) return null;
  const counts = new Map<string, number>();
  for (const b of beers) {
    counts.set(b.style, (counts.get(b.style) ?? 0) + 1);
  }
  let best: string | null = null;
  let max = 0;
  for (const [style, count] of counts) {
    if (count > max) {
      max = count;
      best = style;
    }
  }
  return best;
}

export function StatsBar({ beers }: { beers: Beer[] }) {
  const rated = beers.filter((b) => b.rating !== null);
  const avg =
    rated.length > 0
      ? rated.reduce((s, b) => s + (b.rating ?? 0), 0) / rated.length
      : null;
  const favorite = topStyle(beers);

  const stats = [
    { label: "Beers", value: String(beers.length) },
    { label: "Avg rating", value: avg !== null ? avg.toFixed(1) : "—" },
    { label: "Top style", value: favorite ?? "—" },
  ];

  return (
    <View style={styles.row}>
      {stats.map(({ label, value }) => (
        <View key={label} style={styles.card}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.amberDark + "40",
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.amberLight,
  },
  label: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 2,
  },
});
