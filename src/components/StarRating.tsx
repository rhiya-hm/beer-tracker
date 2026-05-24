"use client";

type StarRatingProps = {
  value: number | null;
  onChange?: (rating: number | null) => void;
  size?: "sm" | "md";
};

export function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const interactive = Boolean(onChange);
  const starSize = size === "sm" ? "text-base" : "text-xl";

  return (
    <div
      className={`inline-flex gap-0.5 ${interactive ? "" : "pointer-events-none"}`}
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Rating" : undefined}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value !== null && star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => {
              if (!onChange) return;
              onChange(value === star ? null : star);
            }}
            className={`${starSize} transition-transform ${
              interactive ? "cursor-pointer hover:scale-110" : ""
            } ${filled ? "text-amber-400" : "text-stone-600"}`}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            {filled ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
