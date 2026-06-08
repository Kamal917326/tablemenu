"use client";

import { UK_ALLERGENS, type Allergen } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  selected: Allergen[];
  onChange: (allergens: Allergen[]) => void;
};

const LABELS: Record<Allergen, string> = {
  celery: "Celery",
  "cereals containing gluten": "Gluten",
  crustaceans: "Crustaceans",
  eggs: "Eggs",
  fish: "Fish",
  lupin: "Lupin",
  milk: "Milk",
  molluscs: "Molluscs",
  mustard: "Mustard",
  nuts: "Nuts",
  peanuts: "Peanuts",
  sesame: "Sesame",
  soybeans: "Soya",
  "sulphur dioxide": "Sulphites",
};

export function MenuFilters({ selected, onChange }: Props) {
  function toggle(allergen: Allergen) {
    if (selected.includes(allergen)) {
      onChange(selected.filter((a) => a !== allergen));
    } else {
      onChange([...selected, allergen]);
    }
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <p className="text-sm font-medium text-stone-800">
        Hide dishes containing:
      </p>
      <p className="mt-1 text-xs text-stone-500">
        UK 14 major allergens — tap to filter your menu
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {UK_ALLERGENS.map((allergen) => {
          const active = selected.includes(allergen);
          return (
            <button
              key={allergen}
              type="button"
              onClick={() => toggle(allergen)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                active
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:border-amber-300"
              )}
            >
              {LABELS[allergen]}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="mt-3 text-xs font-medium text-amber-700 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
