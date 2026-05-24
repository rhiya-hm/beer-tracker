import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Beer } from "../types/beer";

const STORAGE_KEY = "beer-tracker-beers";

export async function loadBeers(): Promise<Beer[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Beer[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveBeers(beers: Beer[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(beers));
}

export function exportBeersJson(beers: Beer[]): string {
  return JSON.stringify(beers, null, 2);
}

export function importBeersJson(json: string): Beer[] {
  const parsed = JSON.parse(json) as Beer[];
  if (!Array.isArray(parsed)) throw new Error("Invalid format");
  return parsed;
}
