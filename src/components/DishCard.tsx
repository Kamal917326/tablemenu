"use client";

import Image from "next/image";
import Link from "next/link";
import { AllergenBadges } from "@/components/AllergenBadges";
import { formatPrice } from "@/lib/data";
import type { Dish } from "@/lib/types";

type Props = {
  dish: Dish;
  href: string;
};

export function DishCard({ dish, href }: Props) {
  return (
    <Link
      href={href}
      className="group flex gap-4 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm transition hover:border-amber-300 hover:shadow-md"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100">
        <Image
          src={dish.imageUrl}
          alt={dish.name}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="96px"
        />
        {dish.arModelUrl && (
          <span className="absolute bottom-1 left-1 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            AR
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-stone-900">{dish.name}</h3>
          <span className="shrink-0 font-medium text-stone-900">
            {formatPrice(dish.pricePence)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-stone-600">
          {dish.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500">{dish.calories} kcal</span>
          {dish.soldOut && (
            <span className="text-xs font-medium text-red-600">Sold out</span>
          )}
        </div>
        <div className="mt-2">
          <AllergenBadges allergens={dish.allergens} />
        </div>
      </div>
    </Link>
  );
}
