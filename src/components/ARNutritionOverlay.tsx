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
  return allergens.map((a) => SHORT[a]).join(", ");
}

function PlainLines({ info }: { info: ARNutritionInfo }) {
  return (
    <>
      <p className="ar-plain-text ar-plain-title">{info.name}</p>
      <p className="ar-plain-text ar-plain-line">{info.calories} kcal · {info.portion}</p>
      <p className="ar-plain-text ar-plain-line">
        Allergens: {allergenLabelText(info.allergens)}
      </p>
    </>
  );
}

export function ARNutritionOverlay({
  info,
  variant = "bottom",
}: {
  info: ARNutritionInfo;
  variant?: "bottom" | "ar-hud";
}) {
  if (variant === "ar-hud") {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[99999] px-4 pt-4">
        <div className="mx-auto max-w-lg">
          <PlainLines info={info} />
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-5 pt-16">
      <PlainLines info={info} />
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
    body: "Calories and allergens appear as plain text on the AR screen from menu data.",
  },
  {
    title: "4. Adjust scale",
    body: "Use Admin → AR models → Scale so the dish sits correctly on the table.",
  },
];
