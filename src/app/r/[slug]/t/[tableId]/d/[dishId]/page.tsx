import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARViewer } from "@/components/ARViewer";
import { AllergenBadges } from "@/components/AllergenBadges";
import { formatPrice, getDish, getRestaurant } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string; tableId: string; dishId: string } };

export default async function DishDetailPage({ params }: Props) {
  const restaurant = await getRestaurant(params.slug);
  if (!restaurant) notFound();

  const dish = getDish(restaurant, params.dishId);
  if (!dish) notFound();

  const menuHref = `/r/${params.slug}/t/${params.tableId}`;

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="relative h-64 w-full bg-stone-200 sm:h-80">
        <Image src={dish.imageUrl} alt={dish.name} fill className="object-cover" priority sizes="100vw" />
        <Link href={menuHref} className="absolute left-4 top-4 rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur">← Menu</Link>
      </div>

      <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
        <div>
          <p className="text-sm text-stone-500">Table {params.tableId} · {restaurant.name}</p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-stone-900">{dish.name}</h1>
            <span className="text-xl font-semibold">{formatPrice(dish.pricePence)}</span>
          </div>
          <p className="mt-3 text-stone-600">{dish.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs uppercase text-stone-500">Calories</p>
            <p className="mt-1 text-lg font-semibold">{dish.calories} kcal</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs uppercase text-stone-500">Portion</p>
            <p className="mt-1 text-lg font-semibold">{dish.portion}</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h2 className="font-semibold">Ingredients</h2>
          <p className="mt-2 text-sm text-stone-600">{dish.ingredients.join(", ")}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h2 className="font-semibold">Allergens</h2>
          <div className="mt-3"><AllergenBadges allergens={dish.allergens} /></div>
        </div>

        {dish.arModelUrl ? (
          <div>
            <h2 className="mb-3 font-semibold">View on your table (AR)</h2>
            <ARViewer src={dish.arModelUrl} alt={dish.name} poster={dish.imageUrl} scale={dish.arScale ?? 1} height={400} />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-white p-5 text-sm text-stone-600">AR preview not enabled for this dish.</div>
        )}
      </div>
    </div>
  );
}
