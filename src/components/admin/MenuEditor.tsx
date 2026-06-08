"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Dish, Restaurant } from "@/lib/types";

export function MenuEditor({ restaurant, onUpdate }: { restaurant: Restaurant; onUpdate: (r: Restaurant) => void }) {
  const [saving, setSaving] = useState<string | null>(null);

  async function patchDish(dishId: string, patch: Partial<Dish>) {
    setSaving(dishId);
    try {
      const res = await fetch(`/api/restaurants/${restaurant.slug}/dishes/${dishId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (res.ok) onUpdate(data.restaurant);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-4">
      {restaurant.dishes.map((dish) => (
        <div key={dish.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex justify-between gap-3">
            <div>
              <h3 className="font-semibold">{dish.name}</h3>
              <p className="text-sm text-stone-500">{dish.description}</p>
            </div>
            <span className="font-semibold">{formatPrice(dish.pricePence)}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" disabled={saving === dish.id} onClick={() => patchDish(dish.id, { soldOut: !dish.soldOut })} className={`rounded-full px-4 py-2 text-sm font-medium ${dish.soldOut ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
              {saving === dish.id ? "Saving…" : dish.soldOut ? "Mark available" : "Mark sold out"}
            </button>
            <label className="flex items-center gap-2 text-sm">
              Price (£)
              <input type="number" step="0.01" defaultValue={(dish.pricePence / 100).toFixed(2)} onBlur={(e) => { const pence = Math.round(parseFloat(e.target.value) * 100); if (!Number.isNaN(pence) && pence !== dish.pricePence) patchDish(dish.id, { pricePence: pence }); }} className="w-24 rounded-lg border px-2 py-1" />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
