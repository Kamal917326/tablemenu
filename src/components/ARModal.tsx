"use client";

import { useEffect, useState } from "react";
import { ARViewer } from "@/components/ARViewer";
import type { Dish } from "@/lib/types";

type Props = {
  dish: Dish;
  onClose: () => void;
};

export function ARModal({ dish, onClose }: Props) {
  const [height, setHeight] = useState(460);

  useEffect(() => {
    setHeight(window.innerHeight < 700 ? 420 : 480);
  }, []);

  if (!dish.arModelUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-400">
            AR menu · Table view
          </p>
          <h2 className="text-lg font-bold text-white">{dish.name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white"
        >
          Close
        </button>
      </div>

      <div className="flex-1 px-3 pb-4">
        <ARViewer
          src={dish.arModelUrl}
          alt={dish.name}
          poster={dish.imageUrl}
          scale={dish.arScale ?? 1}
          height={height}
          nutrition={{
            name: dish.name,
            calories: dish.calories,
            portion: dish.portion,
            allergens: dish.allergens,
            ingredients: dish.ingredients,
          }}
        />
      </div>
    </div>
  );
}
