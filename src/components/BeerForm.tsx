"use client";

import { useEffect, useState } from "react";
import { StarRating } from "@/components/StarRating";
import {
  BEER_STYLES,
  emptyBeerInput,
  type Beer,
  type BeerInput,
} from "@/types/beer";

type BeerFormProps = {
  beer?: Beer;
  onSubmit: (input: BeerInput) => void;
  onCancel: () => void;
};

export function BeerForm({ beer, onSubmit, onCancel }: BeerFormProps) {
  const [form, setForm] = useState<BeerInput>(emptyBeerInput());

  useEffect(() => {
    if (beer) {
      const { id: _, ...rest } = beer;
      setForm(rest);
    } else {
      setForm(emptyBeerInput());
    }
  }, [beer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({ ...form, name: form.name.trim(), brewery: form.brewery.trim() });
  };

  const set = <K extends keyof BeerInput>(key: K, value: BeerInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-amber-900/30 bg-stone-900/80 p-6 shadow-xl backdrop-blur"
    >
      <h2 className="mb-5 text-lg font-semibold text-amber-100">
        {beer ? "Edit beer" : "Log a new beer"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm text-stone-400">Name *</span>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Pliny the Elder"
            className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-stone-400">Brewery</span>
          <input
            value={form.brewery}
            onChange={(e) => set("brewery", e.target.value)}
            placeholder="e.g. Russian River"
            className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-stone-400">Style</span>
          <select
            value={form.style}
            onChange={(e) =>
              set("style", e.target.value as BeerInput["style"])
            }
            className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          >
            {BEER_STYLES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-stone-400">ABV (%)</span>
          <input
            type="number"
            min={0}
            max={20}
            step={0.1}
            value={form.abv ?? ""}
            onChange={(e) =>
              set("abv", e.target.value ? parseFloat(e.target.value) : null)
            }
            placeholder="e.g. 6.5"
            className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-stone-400">Date tried</span>
          <input
            type="date"
            value={form.dateTried}
            onChange={(e) => set("dateTried", e.target.value)}
            className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </label>

        <div className="block sm:col-span-2">
          <span className="mb-2 block text-sm text-stone-400">Rating</span>
          <StarRating
            value={form.rating}
            onChange={(rating) => set("rating", rating)}
          />
        </div>

        <div className="block sm:col-span-2">
          <span className="mb-2 block text-sm text-stone-400">
            Would try again?
          </span>
          <div className="flex gap-2">
            {(
              [
                [true, "Yes"],
                [false, "No"],
                [null, "—"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={label}
                type="button"
                onClick={() => set("wouldTryAgain", val)}
                className={`rounded-lg px-4 py-1.5 text-sm transition-colors ${
                  form.wouldTryAgain === val
                    ? "bg-amber-700 text-amber-50"
                    : "bg-stone-800 text-stone-400 hover:bg-stone-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm text-stone-400">Notes</span>
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            placeholder="Tasting notes, where you had it..."
            className="w-full resize-none rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm text-stone-400 transition-colors hover:text-stone-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-medium text-amber-950 transition-colors hover:bg-amber-500"
        >
          {beer ? "Save changes" : "Add beer"}
        </button>
      </div>
    </form>
  );
}
