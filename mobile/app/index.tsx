import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { BeerCard } from "../src/components/BeerCard";
import { StatsBar } from "../src/components/StatsBar";
import { colors } from "../src/constants/theme";
import { useBeersContext } from "../src/context/BeersContext";
import { exportBeersJson, importBeersJson } from "../src/lib/storage";
import { BEER_STYLES, type Beer } from "../src/types/beer";

type SortKey = "date" | "rating" | "name";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { beers, hydrated, deleteBeer, replaceAll } = useBeersContext();
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState("all");
  const [sort, setSort] = useState<SortKey>("date");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...beers];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.brewery.toLowerCase().includes(q) ||
          b.notes.toLowerCase().includes(q),
      );
    }
    if (styleFilter !== "all") {
      list = list.filter((b) => b.style === styleFilter);
    }
    list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "rating") {
        return (b.rating ?? -1) - (a.rating ?? -1);
      }
      return b.dateTried.localeCompare(a.dateTried);
    });
    return list;
  }, [beers, search, styleFilter, sort]);

  const handleExport = async () => {
    if (beers.length === 0) return;
    const json = exportBeersJson(beers);
    const file = new File(Paths.cache, `beer-tracker-export.json`);
    file.create({ overwrite: true });
    file.write(json);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/json",
        dialogTitle: "Export your beers",
      });
    } else {
      Alert.alert("Export ready", "Sharing is not available on this device.");
    }
  };

  const handleImport = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    try {
      const picked = new File(result.assets[0].uri);
      const json = await picked.text();
      const imported = importBeersJson(json);
      Alert.alert(
        "Import beers",
        `Replace your list with ${imported.length} beers?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Import",
            onPress: () => replaceAll(imported),
          },
        ],
      );
    } catch {
      Alert.alert("Import failed", "That file could not be read.");
    }
  };

  const openForm = (beer?: Beer) => {
    if (beer) {
      router.push({ pathname: "/form", params: { id: beer.id } });
    } else {
      router.push("/form");
    }
  };

  if (!hydrated) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.amber} size="large" />
        <Text style={styles.loadingText}>Loading your cellar...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 88 },
        ]}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>Personal log</Text>
              <Text style={styles.title}>Pintfolio</Text>
              <Text style={styles.subtitle}>
                Every beer you try, in your pocket.
              </Text>
            </View>
            <StatsBar beers={beers} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search beers..."
              placeholderTextColor={colors.textDim}
              style={styles.search}
              clearButtonMode="while-editing"
            />
            <Pressable
              onPress={() => setShowFilters((v) => !v)}
              style={styles.filterToggle}
            >
              <Text style={styles.filterToggleText}>
                {showFilters ? "Hide filters" : "Filter & sort"}
              </Text>
            </Pressable>
            {showFilters && (
              <View style={styles.filters}>
                <View style={styles.pickerWrap}>
                  <Picker
                    selectedValue={styleFilter}
                    onValueChange={setStyleFilter}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="All styles" value="all" />
                    {BEER_STYLES.map((s) => (
                      <Picker.Item key={s} label={s} value={s} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.pickerWrap}>
                  <Picker
                    selectedValue={sort}
                    onValueChange={(v) => setSort(v as SortKey)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="Newest first" value="date" />
                    <Picker.Item label="Highest rated" value="rating" />
                    <Picker.Item label="Name A–Z" value="name" />
                  </Picker>
                </View>
              </View>
            )}
            <View style={styles.actions}>
              <Pressable onPress={handleExport} disabled={beers.length === 0}>
                <Text
                  style={[
                    styles.actionText,
                    beers.length === 0 && styles.disabled,
                  ]}
                >
                  Export
                </Text>
              </Pressable>
              <Text style={styles.actionDot}>·</Text>
              <Pressable onPress={handleImport}>
                <Text style={styles.actionText}>Import</Text>
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🍺</Text>
            <Text style={styles.emptyText}>
              {beers.length === 0
                ? "No beers yet — tap + to log your first!"
                : "No beers match your search."}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <BeerCard
            beer={item}
            onPress={() => openForm(item)}
            onDelete={() => deleteBeer(item.id)}
          />
        )}
      />

      <Pressable
        onPress={() => openForm()}
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  loadingText: { color: colors.textDim, marginTop: 12 },
  listContent: { paddingHorizontal: 20 },
  header: { marginBottom: 20, marginTop: 8 },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.amber,
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 22,
  },
  search: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterToggle: { marginTop: 12, marginBottom: 4 },
  filterToggleText: { color: colors.amber, fontSize: 14, fontWeight: "500" },
  filters: { marginBottom: 8 },
  pickerWrap: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  picker: { height: 120 },
  pickerItem: { color: colors.text, fontSize: 16 },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
  actionText: { color: colors.textDim, fontSize: 14 },
  actionDot: { color: colors.textDim, marginHorizontal: 8 },
  disabled: { opacity: 0.4 },
  empty: { alignItems: "center", paddingVertical: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.amber,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    fontWeight: "300",
    color: "#1c1917",
    marginTop: -2,
  },
});
