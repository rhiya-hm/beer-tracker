"use client";

import { StarRating } from "@/components/StarRating";
import type { Beer } from "@/types/beer";

type BeerCardProps = {
  beer: Beer;
  onEdit: () => void;
  onDelete: () => void;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function BeerCard({ beer, onEdit, onDelete }: BeerCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl border border-amber-900/25 bg-stone-900/60 p-5 transition-colors hover:border-amber-700/40 hover:bg-stone-900/90">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-amber-50">
            {beer.name}
          </h3>
          {beer.brewery && (
            <p className="truncate text-sm text-stone-400">{beer.brewery}</p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-amber-900/50 px-2.5 py-0.5 text-xs font-medium text-amber-200">
          {beer.style}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-stone-400">
        {beer.rating !== null && (
          <StarRating value={beer.rating} size="sm" />
        )}
        {beer.abv !== null && <span>{beer.abv}% ABV</span>}
        <span>{formatDate(beer.dateTried)}</span>
        {beer.wouldTryAgain === true && (
          <span className="text-emerald-500">Would try again</span>
        )}
        {beer.wouldTryAgain === false && (
          <span className="text-rose-400">Would not repeat</span>
        )}
      </div>

      {beer.notes && (
        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-300">
          {beer.notes}
        </p>
      )}

      <div className="mt-auto flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg px-3 py-1.5 text-xs text-amber-400 transition-colors hover:bg-amber-900/30"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg px-3 py-1.5 text-xs text-rose-400 transition-colors hover:bg-rose-900/20"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
