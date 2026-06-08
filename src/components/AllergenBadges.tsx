import type { Allergen } from "@/lib/types";

const SHORT: Record<Allergen, string> = {
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

export function AllergenBadges({ allergens }: { allergens: Allergen[] }) {
  if (allergens.length === 0) {
    return (
      <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
        No listed allergens
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {allergens.map((allergen) => (
        <span
          key={allergen}
          className="text-xs text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full"
        >
          {SHORT[allergen]}
        </span>
      ))}
    </div>
  );
}
