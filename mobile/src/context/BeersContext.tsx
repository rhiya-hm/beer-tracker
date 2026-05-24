import * as Crypto from "expo-crypto";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadBeers, saveBeers } from "../lib/storage";
import type { Beer, BeerInput } from "../types/beer";

type BeersContextValue = {
  beers: Beer[];
  hydrated: boolean;
  addBeer: (input: BeerInput) => void;
  updateBeer: (id: string, input: BeerInput) => void;
  deleteBeer: (id: string) => void;
  replaceAll: (beers: Beer[]) => void;
  getBeer: (id: string) => Beer | undefined;
};

const BeersContext = createContext<BeersContextValue | null>(null);

export function BeersProvider({ children }: { children: ReactNode }) {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadBeers().then((loaded) => {
      setBeers(loaded);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) saveBeers(beers);
  }, [beers, hydrated]);

  const addBeer = useCallback((input: BeerInput) => {
    const beer: Beer = { ...input, id: Crypto.randomUUID() };
    setBeers((prev) => [beer, ...prev]);
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

  const getBeer = useCallback(
    (id: string) => beers.find((b) => b.id === id),
    [beers],
  );

  const value = useMemo(
    () => ({
      beers,
      hydrated,
      addBeer,
      updateBeer,
      deleteBeer,
      replaceAll,
      getBeer,
    }),
    [beers, hydrated, addBeer, updateBeer, deleteBeer, replaceAll, getBeer],
  );

  return (
    <BeersContext.Provider value={value}>{children}</BeersContext.Provider>
  );
}

export function useBeersContext() {
  const ctx = useContext(BeersContext);
  if (!ctx) throw new Error("useBeersContext must be used within BeersProvider");
  return ctx;
}
