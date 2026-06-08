import { promises as fs } from "fs";
import path from "path";
import type { Dish, Restaurant } from "./types";
import { seedRestaurants } from "./seed";

const BUNDLED_DATA_PATH = path.join(process.cwd(), "data", "restaurants.json");
const RUNTIME_DATA_PATH =
  process.env.VERCEL === "1"
    ? path.join("/tmp", "tablemenu-restaurants.json")
    : BUNDLED_DATA_PATH;

async function readBundledData(): Promise<Record<string, Restaurant>> {
  try {
    const raw = await fs.readFile(BUNDLED_DATA_PATH, "utf-8");
    return JSON.parse(raw) as Record<string, Restaurant>;
  } catch {
    return structuredClone(seedRestaurants);
  }
}

async function ensureStore(): Promise<Record<string, Restaurant>> {
  try {
    const raw = await fs.readFile(RUNTIME_DATA_PATH, "utf-8");
    return JSON.parse(raw) as Record<string, Restaurant>;
  } catch {
    const data = await readBundledData();
    try {
      await fs.writeFile(RUNTIME_DATA_PATH, JSON.stringify(data, null, 2));
    } catch {
      // Read-only filesystem — demo still works from bundled seed data.
    }
    return data;
  }
}

async function saveAll(data: Record<string, Restaurant>): Promise<void> {
  await fs.writeFile(RUNTIME_DATA_PATH, JSON.stringify(data, null, 2));
}

export async function getAllRestaurants(): Promise<Record<string, Restaurant>> {
  return ensureStore();
}

export async function getRestaurant(
  slug: string
): Promise<Restaurant | undefined> {
  const all = await ensureStore();
  return all[slug];
}

export async function updateDish(
  slug: string,
  dishId: string,
  patch: Partial<Dish>
): Promise<Restaurant | null> {
  const all = await ensureStore();
  const restaurant = all[slug];
  if (!restaurant) return null;

  const index = restaurant.dishes.findIndex((d) => d.id === dishId);
  if (index === -1) return null;

  restaurant.dishes[index] = { ...restaurant.dishes[index], ...patch };
  all[slug] = restaurant;

  try {
    await saveAll(all);
  } catch {
    // Admin edits may not persist on read-only hosts; menu still updates in memory for this request.
  }

  return restaurant;
}

export async function addDish(
  slug: string,
  dish: Dish
): Promise<Restaurant | null> {
  const all = await ensureStore();
  const restaurant = all[slug];
  if (!restaurant) return null;

  if (restaurant.dishes.some((d) => d.id === dish.id)) {
    return null;
  }

  restaurant.dishes.push(dish);
  all[slug] = restaurant;

  try {
    await saveAll(all);
  } catch {
    // same as updateDish
  }

  return restaurant;
}

export async function deleteDish(
  slug: string,
  dishId: string
): Promise<Restaurant | null> {
  const all = await ensureStore();
  const restaurant = all[slug];
  if (!restaurant) return null;

  const next = restaurant.dishes.filter((d) => d.id !== dishId);
  if (next.length === restaurant.dishes.length) return null;

  restaurant.dishes = next;
  all[slug] = restaurant;

  try {
    await saveAll(all);
  } catch {
    // same as updateDish
  }

  return restaurant;
}

export function getDish(
  restaurant: Restaurant,
  dishId: string
): Dish | undefined {
  return restaurant.dishes.find((d) => d.id === dishId);
}
