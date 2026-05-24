import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";
import type { Beer } from "../types/beer";
import { StarRating } from "./StarRating";

type BeerCardProps = {
  beer: Beer;
  onPress: () => void;
  onDelete: () => void;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function BeerCard({ beer, onPress, onDelete }: BeerCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.name} numberOfLines={1}>
            {beer.name}
          </Text>
          {beer.brewery ? (
            <Text style={styles.brewery} numberOfLines={1}>
              {beer.brewery}
            </Text>
          ) : null}
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{beer.style}</Text>
        </View>
      </View>

      <View style={styles.meta}>
        {beer.rating !== null && <StarRating value={beer.rating} size="sm" />}
        {beer.abv !== null && (
          <Text style={styles.metaText}>{beer.abv}% ABV</Text>
        )}
        <Text style={styles.metaText}>{formatDate(beer.dateTried)}</Text>
      </View>

      {beer.wouldTryAgain === true && (
        <Text style={styles.tryAgain}>Would try again</Text>
      )}
      {beer.wouldTryAgain === false && (
        <Text style={styles.skip}>Would not repeat</Text>
      )}

      {beer.notes ? (
        <Text style={styles.notes} numberOfLines={2}>
          {beer.notes}
        </Text>
      ) : null}

      <Pressable
        onPress={() =>
          Alert.alert("Delete beer", `Remove "${beer.name}"?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: onDelete },
          ])
        }
        hitSlop={12}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.amberDark + "35",
    marginBottom: 12,
  },
  pressed: { opacity: 0.85 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  titleBlock: { flex: 1, minWidth: 0 },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  brewery: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.amberDark + "80",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.amberLight,
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  metaText: { fontSize: 13, color: colors.textDim },
  tryAgain: { fontSize: 13, color: colors.success, marginBottom: 4 },
  skip: { fontSize: 13, color: colors.danger, marginBottom: 4 },
  notes: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: 4,
  },
  deleteBtn: { alignSelf: "flex-start", marginTop: 10, paddingVertical: 4 },
  deleteText: { fontSize: 13, color: colors.danger },
});
