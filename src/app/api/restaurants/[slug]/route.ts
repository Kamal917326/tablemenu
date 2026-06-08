import { NextResponse } from "next/server";
import { getRestaurant } from "@/lib/store";

type Params = { params: { slug: string } };

export async function GET(_request: Request, { params }: Params) {
  const restaurant = await getRestaurant(params.slug);
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }
  return NextResponse.json(restaurant);
}
