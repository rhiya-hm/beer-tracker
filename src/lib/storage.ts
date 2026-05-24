import type { Beer } from "@/types/beer";

const STORAGE_KEY = "beer-tracker-beers";

export function loadBeers(): Beer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Beer[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBeers(beers: Beer[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(beers));
}

export function exportBeersJson(beers: Beer[]): string {
  return JSON.stringify(beers, null, 2);
}

export function importBeersJson(json: string): Beer[] {
  const parsed = JSON.parse(json) as Beer[];
  if (!Array.isArray(parsed)) throw new Error("Invalid format");
  return parsed;
}
