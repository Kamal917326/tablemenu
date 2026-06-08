import { NextResponse } from "next/server";
import type { Dish } from "@/lib/types";
import { UK_ALLERGENS } from "@/lib/types";
import { addDish } from "@/lib/store";
import { dishIdFromName } from "@/lib/utils";

type Params = { params: { slug: string } };

export async function POST(request: Request, { params }: Params) {
  const body = (await request.json()) as Partial<Dish>;

  if (!body.name?.trim() || !body.categoryId || typeof body.pricePence !== "number") {
    return NextResponse.json(
      { error: "Name, category, and price are required" },
      { status: 400 }
    );
  }

  const { getRestaurant } = await import("@/lib/store");
  const restaurant = await getRestaurant(params.slug);
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  if (!restaurant.categories.some((c) => c.id === body.categoryId)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const allergens = (body.allergens ?? []).filter((a) =>
    UK_ALLERGENS.includes(a as (typeof UK_ALLERGENS)[number])
  );

  const id =
    body.id?.trim() ||
    dishIdFromName(
      body.name,
      restaurant.dishes.map((d) => d.id)
    );

  const dish: Dish = {
    id,
    name: body.name.trim(),
    description: body.description?.trim() ?? "",
    pricePence: Math.max(0, Math.round(body.pricePence)),
    categoryId: body.categoryId,
    imageUrl:
      body.imageUrl?.trim() ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    calories: typeof body.calories === "number" ? body.calories : 0,
    portion: body.portion?.trim() ?? "",
    ingredients: Array.isArray(body.ingredients) ? body.ingredients : [],
    allergens,
    soldOut: false,
  };

  const updated = await addDish(params.slug, dish);
  if (!updated) {
    return NextResponse.json({ error: "Could not add dish" }, { status: 409 });
  }

  return NextResponse.json({ dish, restaurant: updated }, { status: 201 });
}
