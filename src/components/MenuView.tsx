"use client";

import { useMemo, useState } from "react";
import { CallWaiterButton } from "@/components/CallWaiterButton";
import { DishCard } from "@/components/DishCard";
import { MenuFilters } from "@/components/MenuFilters";
import type { Restaurant } from "@/lib/types";
import type { Allergen } from "@/lib/types";

type Props = {
  restaurant: Restaurant;
  tableId: string;
};

export function MenuView({ restaurant, tableId }: Props) {
  const [hiddenAllergens, setHiddenAllergens] = useState<Allergen[]>([]);

  const categories = useMemo(
    () => [...restaurant.categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [restaurant.categories]
  );

  const visibleDishes = useMemo(() => {
    return restaurant.dishes.filter((dish) => {
      if (dish.soldOut) return true;
      return !dish.allergens.some((a) => hiddenAllergens.includes(a));
    });
  }, [restaurant.dishes, hiddenAllergens]);

  return (
    <div className="min-h-screen bg-stone-100 pb-24">
      <header className="bg-stone-900 px-4 pb-8 pt-10 text-white">
        <p className="text-xs uppercase tracking-widest text-amber-400">
          Table {tableId}
        </p>
        <h1 className="mt-2 text-3xl font-bold">{restaurant.name}</h1>
        <p className="mt-1 text-stone-300">{restaurant.tagline}</p>
        <p className="mt-3 text-xs text-stone-400">{restaurant.address}</p>
      </header>

      <div className="mx-auto max-w-lg space-y-6 px-4 -mt-4">
        <MenuFilters selected={hiddenAllergens} onChange={setHiddenAllergens} />

        {categories.map((category) => {
          const dishes = visibleDishes
            .filter((d) => d.categoryId === category.id)
            .sort((a, b) => a.name.localeCompare(b.name));

          if (dishes.length === 0) return null;

          return (
            <section key={category.id}>
              <h2 className="mb-3 text-lg font-semibold text-stone-800">
                {category.name}
              </h2>
              <div className="space-y-3">
                {dishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    href={`/r/${restaurant.slug}/t/${tableId}/d/${dish.id}`}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {visibleDishes.length === 0 && (
          <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center text-sm text-stone-600">
            No dishes match your allergen filters. Try clearing a filter above.
          </p>
        )}
      </div>

      <CallWaiterButton tableId={tableId} />
    </div>
  );
}
