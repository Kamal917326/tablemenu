export const UK_ALLERGENS = [
  "celery",
  "cereals containing gluten",
  "crustaceans",
  "eggs",
  "fish",
  "lupin",
  "milk",
  "molluscs",
  "mustard",
  "nuts",
  "peanuts",
  "sesame",
  "soybeans",
  "sulphur dioxide",
] as const;

export type Allergen = (typeof UK_ALLERGENS)[number];

export type Dish = {
  id: string;
  name: string;
  description: string;
  pricePence: number;
  categoryId: string;
  imageUrl: string;
  calories: number;
  portion: string;
  ingredients: string[];
  allergens: Allergen[];
  arModelUrl?: string;
  arScale?: number;
  soldOut?: boolean;
};

export type Category = {
  id: string;
  name: string;
  sortOrder: number;
};

export type Restaurant = {
  slug: string;
  name: string;
  tagline: string;
  address: string;
  tableCount: number;
  categories: Category[];
  dishes: Dish[];
};
