"use client";

import { ARViewer } from "@/components/ARViewer";
import type { Dish } from "@/lib/types";

type Props = {
  dish: Dish;
  onClose: () => void;
};

export function ARModal({ dish, onClose }: Props) {
  if (!dish.arModelUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-amber-600">
              AR preview
            </p>
            <h2 className="text-lg font-bold text-stone-900">{dish.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700"
          >
            Close
          </button>
        </div>

        <div className="p-4">
          <ARViewer
            src={dish.arModelUrl}
            alt={dish.name}
            poster={dish.imageUrl}
            scale={dish.arScale ?? 1}
            height={360}
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-stone-50 p-3">
              <p className="text-xs text-stone-500">Calories</p>
              <p className="font-semibold text-stone-900">{dish.calories} kcal</p>
            </div>
            <div className="rounded-xl bg-stone-50 p-3">
              <p className="text-xs text-stone-500">Portion</p>
              <p className="font-semibold text-stone-900">{dish.portion}</p>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-stone-50 p-3">
            <p className="text-xs text-stone-500">Ingredients</p>
            <p className="mt-1 text-sm text-stone-700">
              {dish.ingredients.join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
