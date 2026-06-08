import { NextResponse } from "next/server";
import type { Dish } from "@/lib/types";
import { UK_ALLERGENS } from "@/lib/types";
import { deleteDish, updateDish } from "@/lib/store";

type Params = { params: { slug: string; dishId: string } };

export async function DELETE(_request: Request, { params }: Params) {
  const restaurant = await deleteDish(params.slug, params.dishId);
  if (!restaurant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ restaurant });
}

export async function PATCH(request: Request, { params }: Params) {
  const body = (await request.json()) as Partial<Dish>;

  const allowed: Partial<Dish> = {};
  if (typeof body.soldOut === "boolean") allowed.soldOut = body.soldOut;
  if (typeof body.pricePence === "number") allowed.pricePence = body.pricePence;
  if (typeof body.name === "string") allowed.name = body.name;
  if (typeof body.description === "string") allowed.description = body.description;
  if (typeof body.calories === "number") allowed.calories = body.calories;
  if (typeof body.portion === "string") allowed.portion = body.portion;
  if (typeof body.imageUrl === "string") allowed.imageUrl = body.imageUrl;
  if (typeof body.categoryId === "string") allowed.categoryId = body.categoryId;
  if (Array.isArray(body.ingredients)) allowed.ingredients = body.ingredients;
  if (Array.isArray(body.allergens)) {
    allowed.allergens = body.allergens.filter((a) =>
      UK_ALLERGENS.includes(a as (typeof UK_ALLERGENS)[number])
    );
  }
  if (typeof body.arScale === "number") allowed.arScale = body.arScale;
  if ("arModelUrl" in body && body.arModelUrl === null) {
    allowed.arModelUrl = undefined;
    allowed.arScale = undefined;
  } else if (typeof body.arModelUrl === "string") {
    allowed.arModelUrl = body.arModelUrl;
  }

  const restaurant = await updateDish(params.slug, params.dishId, allowed);
  if (!restaurant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const dish = restaurant.dishes.find((d) => d.id === params.dishId);
  return NextResponse.json({ dish, restaurant });
}
