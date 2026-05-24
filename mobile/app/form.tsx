import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FormField } from "../src/components/FormField";
import { StarRating } from "../src/components/StarRating";
import { colors } from "../src/constants/theme";
import { useBeersContext } from "../src/context/BeersContext";
import {
  BEER_STYLES,
  emptyBeerInput,
  type BeerInput,
} from "../src/types/beer";

export default function FormScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getBeer, addBeer, updateBeer } = useBeersContext();
  const editing = id ? getBeer(id) : undefined;

  const [form, setForm] = useState<BeerInput>(emptyBeerInput());

  useEffect(() => {
    if (editing) {
      const { id: _, ...rest } = editing;
      setForm(rest);
    }
  }, [editing]);

  const set = <K extends keyof BeerInput>(key: K, value: BeerInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    const input = {
      ...form,
      name: form.name.trim(),
      brewery: form.brewery.trim(),
    };
    if (editing) updateBeer(editing.id, input);
    else addBeer(input);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {editing ? "Edit beer" : "Log beer"}
        </Text>
        <Pressable onPress={handleSave} hitSlop={12}>
          <Text style={styles.save}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <FormField
          label="Name *"
          value={form.name}
          onChangeText={(v) => set("name", v)}
          placeholder="e.g. Pliny the Elder"
          autoCapitalize="words"
          returnKeyType="next"
        />
        <FormField
          label="Brewery"
          value={form.brewery}
          onChangeText={(v) => set("brewery", v)}
          placeholder="e.g. Russian River"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Style</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={form.style}
            onValueChange={(v) => set("style", v)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {BEER_STYLES.map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>
        </View>

        <FormField
          label="ABV (%)"
          value={form.abv !== null ? String(form.abv) : ""}
          onChangeText={(v) =>
            set("abv", v ? parseFloat(v.replace(",", ".")) : null)
          }
          placeholder="e.g. 6.5"
          keyboardType="decimal-pad"
        />
        <FormField
          label="Date tried (YYYY-MM-DD)"
          value={form.dateTried}
          onChangeText={(v) => set("dateTried", v)}
          placeholder="2026-05-24"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Rating</Text>
        <StarRating value={form.rating} onChange={(r) => set("rating", r)} />

        <Text style={[styles.label, { marginTop: 20 }]}>Would try again?</Text>
        <View style={styles.segmentRow}>
          {(
            [
              [true, "Yes"],
              [false, "No"],
              [null, "—"],
            ] as const
          ).map(([val, label]) => (
            <Pressable
              key={label}
              onPress={() => set("wouldTryAgain", val)}
              style={[
                styles.segment,
                form.wouldTryAgain === val && styles.segmentActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  form.wouldTryAgain === val && styles.segmentTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <FormField
          label="Notes"
          value={form.notes}
          onChangeText={(v) => set("notes", v)}
          placeholder="Tasting notes, where you had it..."
          multiline
          numberOfLines={4}
          style={styles.notes}
          textAlignVertical="top"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  cancel: { fontSize: 17, color: colors.textMuted },
  headerTitle: { fontSize: 17, fontWeight: "600", color: colors.text },
  save: { fontSize: 17, fontWeight: "600", color: colors.amber },
  scroll: { padding: 20 },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
  },
  pickerWrap: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: { height: 140 },
  pickerItem: { color: colors.text, fontSize: 18 },
  segmentRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  segmentActive: { backgroundColor: colors.amber },
  segmentText: { color: colors.textMuted, fontWeight: "500" },
  segmentTextActive: { color: "#1c1917", fontWeight: "600" },
  notes: { minHeight: 100, paddingTop: 12 },
});
