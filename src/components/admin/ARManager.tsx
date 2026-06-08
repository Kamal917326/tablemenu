"use client";

import { useState } from "react";
import { ARViewer } from "@/components/ARViewer";
import { AR_PRESETS } from "@/lib/ar-presets";
import type { Dish, Restaurant } from "@/lib/types";

export function ARManager({ restaurant, onUpdate }: { restaurant: Restaurant; onUpdate: (r: Restaurant) => void }) {
  const [saving, setSaving] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState(restaurant.dishes.find((d) => d.arModelUrl)?.id ?? null);

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

  const preview = restaurant.dishes.find((d) => d.id === previewId);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Enable AR on signature dishes. Guests tap <strong>View on table</strong> from the menu.
      </div>
      {preview?.arModelUrl && (
        <ARViewer src={preview.arModelUrl} alt={preview.name} poster={preview.imageUrl} scale={preview.arScale ?? 1} height={320} compact />
      )}
      {restaurant.dishes.map((dish) => (
        <div key={dish.id} className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex justify-between">
            <h3 className="font-semibold">{dish.name}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${dish.arModelUrl ? "bg-emerald-100 text-emerald-800" : "bg-stone-100"}`}>{dish.arModelUrl ? "AR on" : "AR off"}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {AR_PRESETS.map((p) => (
              <button key={p.id} type="button" disabled={saving === dish.id} onClick={() => { setPreviewId(dish.id); patchDish(dish.id, { arModelUrl: p.modelUrl, arScale: p.defaultScale }); }} className="rounded-full border px-3 py-1 text-xs hover:bg-amber-50">{p.label}</button>
            ))}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_120px]">
            <input type="url" placeholder="Custom .glb URL" defaultValue={dish.arModelUrl ?? ""} onBlur={(e) => { const url = e.target.value.trim(); if (url && url !== dish.arModelUrl) { setPreviewId(dish.id); patchDish(dish.id, { arModelUrl: url, arScale: dish.arScale ?? 1 }); } }} className="rounded-lg border px-3 py-2 text-sm" />
            <input type="number" step="0.05" defaultValue={dish.arScale ?? 1} onBlur={(e) => { const s = parseFloat(e.target.value); if (!Number.isNaN(s) && s !== dish.arScale) patchDish(dish.id, { arScale: s }); }} className="rounded-lg border px-3 py-2 text-sm" />
          </div>
          <div className="mt-2 flex gap-3">
            <button type="button" onClick={() => setPreviewId(dish.id)} className="text-sm text-amber-700 underline">Preview</button>
            {dish.arModelUrl && <button type="button" disabled={saving === dish.id} onClick={() => patchDish(dish.id, { arModelUrl: null as unknown as string })} className="text-sm text-red-600 underline">Disable AR</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
