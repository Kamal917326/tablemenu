import { promises as fs } from "fs";
import path from "path";
import type { Dish, Restaurant } from "./types";
import { seedRestaurants } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_PATH = path.join(DATA_DIR, "restaurants.json");

async function ensureStore(): Promise<Record<string, Restaurant>> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as Record<string, Restaurant>;
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(seedRestaurants, null, 2));
    return structuredClone(seedRestaurants);
  }
}

async function saveAll(data: Record<string, Restaurant>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
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
  await saveAll(all);
  return restaurant;
}

export function getDish(
  restaurant: Restaurant,
  dishId: string
): Dish | undefined {
  return restaurant.dishes.find((d) => d.id === dishId);
}

export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

export function getMenuUrl(slug: string, tableId: string, baseUrl: string) {
  return `${baseUrl.replace(/\/$/, "")}/r/${slug}/t/${tableId}`;
}

export function getQrImageUrl(menuUrl: string, size = 280): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(menuUrl)}`;
}
