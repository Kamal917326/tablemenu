import { NextResponse } from "next/server";
import type { Dish } from "@/lib/types";
import { updateDish } from "@/lib/store";

type Params = { params: { slug: string; dishId: string } };

export async function PATCH(request: Request, { params }: Params) {
  const body = (await request.json()) as Partial<Dish>;

  const allowed: Partial<Dish> = {};
  if (typeof body.soldOut === "boolean") allowed.soldOut = body.soldOut;
  if (typeof body.pricePence === "number") allowed.pricePence = body.pricePence;
  if (typeof body.name === "string") allowed.name = body.name;
  if (typeof body.description === "string") allowed.description = body.description;
  if (typeof body.calories === "number") allowed.calories = body.calories;
  if (typeof body.portion === "string") allowed.portion = body.portion;
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
