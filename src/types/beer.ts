export const BEER_STYLES = [
  "IPA",
  "Pale Ale",
  "Stout",
  "Porter",
  "Lager",
  "Pilsner",
  "Wheat",
  "Sour",
  "Amber",
  "Belgian",
  "Saison",
  "Barleywine",
  "Other",
] as const;

export type BeerStyle = (typeof BEER_STYLES)[number];

export type Beer = {
  id: string;
  name: string;
  brewery: string;
  style: BeerStyle;
  rating: number | null;
  abv: number | null;
  dateTried: string;
  notes: string;
  wouldTryAgain: boolean | null;
};

export type BeerInput = Omit<Beer, "id">;

export const emptyBeerInput = (): BeerInput => ({
  name: "",
  brewery: "",
  style: "Other",
  rating: null,
  abv: null,
  dateTried: new Date().toISOString().slice(0, 10),
  notes: "",
  wouldTryAgain: null,
});
