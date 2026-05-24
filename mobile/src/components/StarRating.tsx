import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

type StarRatingProps = {
  value: number | null;
  onChange?: (rating: number | null) => void;
  size?: "sm" | "md";
};

export function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const interactive = Boolean(onChange);
  const fontSize = size === "sm" ? 16 : 24;

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value !== null && star <= value;
        return (
          <Pressable
            key={star}
            disabled={!interactive}
            onPress={() => onChange?.(value === star ? null : star)}
            hitSlop={8}
          >
            <Text
              style={[
                styles.star,
                { fontSize },
                filled ? styles.filled : styles.empty,
              ]}
            >
              {filled ? "★" : "☆"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 4 },
  star: { lineHeight: 28 },
  filled: { color: colors.amberLight },
  empty: { color: colors.border },
});
