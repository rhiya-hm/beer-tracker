"use client";

import type { Beer } from "@/types/beer";

type StatsBarProps = {
  beers: Beer[];
};

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

export function StatsBar({ beers }: StatsBarProps) {
  const rated = beers.filter((b) => b.rating !== null);
  const avg =
    rated.length > 0
      ? rated.reduce((s, b) => s + (b.rating ?? 0), 0) / rated.length
      : null;
  const favorite = topStyle(beers);

  const stats = [
    { label: "Beers logged", value: String(beers.length) },
    {
      label: "Avg rating",
      value: avg !== null ? avg.toFixed(1) : "—",
    },
    { label: "Top style", value: favorite ?? "—" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-xl border border-amber-900/20 bg-stone-900/50 px-4 py-3 text-center"
        >
          <p className="text-2xl font-bold text-amber-400">{value}</p>
          <p className="text-xs text-stone-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
