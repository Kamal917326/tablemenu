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
};

export function ARNutritionOverlay({ info }: { info: ARNutritionInfo }) {
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
      <p className="mt-2 text-[10px] text-stone-400">
        Nutrition info stays on screen while you view the dish in AR
      </p>
    </div>
  );
}

export const IMAGE_TO_AR_STEPS = [
  {
    title: "1. Scan or model the real dish",
    body: "A flat photo cannot become AR automatically. Scan the plated dish with Polycam, Scaniverse, or Luma AI — or use Meshy / Tripo3D to generate a 3D model from photos.",
  },
  {
    title: "2. Export as .glb",
    body: "Export a glTF Binary (.glb) file, ideally under 10 MB so phones load it fast.",
  },
  {
    title: "3. Host the file",
    body: "Upload to Cloudinary, GitHub, your website, or the project's public/models folder. Copy the public HTTPS link.",
  },
  {
    title: "4. Paste in admin → AR models",
    body: "Open Admin → AR models, paste the .glb URL, adjust scale, and save. Calories and allergens show as text on the AR view automatically.",
  },
];
