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

export type ARNutritionInfo = {
  name: string;
  calories: number;
  portion: string;
  allergens: Allergen[];
  ingredients?: string[];
};

export function allergenLabelText(allergens: Allergen[]): string {
  if (allergens.length === 0) return "No listed allergens";
  return allergens.map((a) => SHORT[a]).join(" · ");
}

export function ARNutritionOverlay({
  info,
  variant = "bottom",
}: {
  info: ARNutritionInfo;
  variant?: "bottom" | "top" | "ar-hud";
}) {
  if (variant === "ar-hud") {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[99999] px-3 pt-3">
        <div className="mx-auto max-w-lg rounded-2xl border border-white/20 bg-black/75 px-4 py-3 backdrop-blur-md">
          <p className="text-base font-bold text-white">{info.name}</p>
          <p className="mt-1 text-2xl font-black text-amber-400">
            {info.calories} kcal
          </p>
          <p className="text-sm text-stone-200">{info.portion}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-red-300">
            Allergens: {allergenLabelText(info.allergens)}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "top") {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/90 via-black/70 to-transparent px-4 pb-8 pt-3">
        <p className="text-sm font-semibold text-white">{info.name}</p>
        <p className="mt-1 text-xl font-bold text-amber-400">{info.calories} kcal</p>
        <p className="text-xs text-stone-300">{info.portion}</p>
        <p className="mt-2 text-xs font-medium text-red-200">
          Allergens: {allergenLabelText(info.allergens)}
        </p>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/75 to-transparent px-4 pb-4 pt-12">
      <p className="text-sm font-semibold text-white">{info.name}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-amber-500 px-2.5 py-1 text-sm font-bold text-stone-950">
          {info.calories} kcal
        </span>
        <span className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {info.portion}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {info.allergens.length === 0 ? (
          <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[11px] font-medium text-white">
            No listed allergens
          </span>
        ) : (
          info.allergens.map((a) => (
            <span
              key={a}
              className="rounded-full bg-red-500/90 px-2 py-0.5 text-[11px] font-medium text-white"
            >
              {SHORT[a]}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

export const IMAGE_TO_AR_STEPS = [
  {
    title: "1. Scan or model the real dish",
    body: "Scan the plated dish with Polycam or Scaniverse, then export as .glb.",
  },
  {
    title: "2. Host the .glb file",
    body: "Save to public/models/ or upload to Cloudinary. Paste the HTTPS link in admin.",
  },
  {
    title: "3. Nutrition text in AR",
    body: "Calories and allergens appear as text on the AR screen automatically from menu data.",
  },
  {
    title: "4. Adjust scale",
    body: "Use Admin → AR models → Scale so the dish sits correctly on the table.",
  },
];
