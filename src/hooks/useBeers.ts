"use client";

import { useCallback, useEffect, useState } from "react";
import { loadBeers, saveBeers } from "@/lib/storage";
import type { Beer, BeerInput } from "@/types/beer";

function generateId(): string {
  return crypto.randomUUID();
}

export function useBeers() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBeers(loadBeers());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveBeers(beers);
  }, [beers, hydrated]);

  const addBeer = useCallback((input: BeerInput) => {
    const beer: Beer = { ...input, id: generateId() };
    setBeers((prev) => [beer, ...prev]);
    return beer;
  }, []);

  const updateBeer = useCallback((id: string, input: BeerInput) => {
    setBeers((prev) =>
      prev.map((b) => (b.id === id ? { ...input, id } : b)),
    );
  }, []);

  const deleteBeer = useCallback((id: string) => {
    setBeers((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const replaceAll = useCallback((next: Beer[]) => {
    setBeers(next);
  }, []);

  return {
    beers,
    hydrated,
    addBeer,
    updateBeer,
    deleteBeer,
    replaceAll,
  };
}
