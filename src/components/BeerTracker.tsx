"use client";

import { useMemo, useRef, useState } from "react";
import { BeerCard } from "@/components/BeerCard";
import { BeerForm } from "@/components/BeerForm";
import { StatsBar } from "@/components/StatsBar";
import { useBeers } from "@/hooks/useBeers";
import { exportBeersJson, importBeersJson } from "@/lib/storage";
import { BEER_STYLES, type Beer } from "@/types/beer";

type SortKey = "date" | "rating" | "name";

export function BeerTracker() {
  const { beers, hydrated, addBeer, updateBeer, deleteBeer, replaceAll } =
    useBeers();
  const [showForm, setShowForm] = useState(false);
  const [editingBeer, setEditingBeer] = useState<Beer | undefined>();
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("date");
  const importRef = useRef<HTMLInputElement>(null);

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
        const ra = a.rating ?? -1;
        const rb = b.rating ?? -1;
        return rb - ra;
      }
      return b.dateTried.localeCompare(a.dateTried);
    });
    return list;
  }, [beers, search, styleFilter, sort]);

  const openAdd = () => {
    setEditingBeer(undefined);
    setShowForm(true);
  };

  const openEdit = (beer: Beer) => {
    setEditingBeer(beer);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBeer(undefined);
  };

  const handleExport = () => {
    const blob = new Blob([exportBeersJson(beers)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beer-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = importBeersJson(reader.result as string);
        if (
          !confirm(
            `Import ${imported.length} beers? This will replace your current list.`,
          )
        )
          return;
        replaceAll(imported);
      } catch {
        alert("Could not read that file. Make sure it is a valid export.");
      }
    };
    reader.readAsText(file);
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-stone-500">
        Loading your cellar...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium uppercase tracking-widest text-amber-600">
              Personal log
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-amber-50">
              Pintfolio
            </h1>
            <p className="mt-2 max-w-md text-stone-400">
              Keep a record of every beer you try — ratings, notes, and all.
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="rounded-xl bg-amber-600 px-5 py-2.5 font-medium text-amber-950 shadow-lg shadow-amber-900/30 transition-colors hover:bg-amber-500"
          >
            + Log beer
          </button>
        </div>
        <StatsBar beers={beers} />
      </header>

      {showForm && (
        <div className="mb-10">
          <BeerForm
            beer={editingBeer}
            onSubmit={(input) => {
              if (editingBeer) updateBeer(editingBeer.id, input);
              else addBeer(input);
              closeForm();
            }}
            onCancel={closeForm}
          />
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search beers..."
          className="min-w-[200px] flex-1 rounded-lg border border-stone-700 bg-stone-900/60 px-3 py-2 text-sm text-stone-100 placeholder:text-stone-600 focus:border-amber-600 focus:outline-none"
        />
        <select
          value={styleFilter}
          onChange={(e) => setStyleFilter(e.target.value)}
          className="rounded-lg border border-stone-700 bg-stone-900/60 px-3 py-2 text-sm text-stone-100 focus:border-amber-600 focus:outline-none"
        >
          <option value="all">All styles</option>
          {BEER_STYLES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-stone-700 bg-stone-900/60 px-3 py-2 text-sm text-stone-100 focus:border-amber-600 focus:outline-none"
        >
          <option value="date">Newest first</option>
          <option value="rating">Highest rated</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-700 py-20 text-center">
          <p className="text-4xl mb-3">🍺</p>
          <p className="text-lg text-stone-300">
            {beers.length === 0
              ? "No beers yet — log your first one!"
              : "No beers match your search."}
          </p>
          {beers.length === 0 && (
            <button
              type="button"
              onClick={openAdd}
              className="mt-4 text-amber-500 hover:text-amber-400"
            >
              Add a beer →
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((beer) => (
            <BeerCard
              key={beer.id}
              beer={beer}
              onEdit={() => openEdit(beer)}
              onDelete={() => {
                if (confirm(`Remove "${beer.name}" from your log?`)) {
                  deleteBeer(beer.id);
                }
              }}
            />
          ))}
        </div>
      )}

      <footer className="mt-12 flex flex-wrap gap-4 border-t border-stone-800 pt-6 text-sm text-stone-500">
        <button
          type="button"
          onClick={handleExport}
          disabled={beers.length === 0}
          className="hover:text-amber-500 disabled:opacity-40"
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => importRef.current?.click()}
          className="hover:text-amber-500"
        >
          Import JSON
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport(file);
            e.target.value = "";
          }}
        />
        <span className="ml-auto text-stone-600">
          Data saved in your browser
        </span>
      </footer>
    </div>
  );
}
