"use client";

import { useState } from "react";
import { ARViewer } from "@/components/ARViewer";
import { PolycamScanGuide } from "@/components/admin/PolycamScanGuide";
import { POLYCAM_DEMO_DISHES } from "@/lib/polycam-guide";
import type { Dish, Restaurant } from "@/lib/types";

export function ARManager({
  restaurant,
  onUpdate,
}: {
  restaurant: Restaurant;
  onUpdate: (r: Restaurant) => void;
}) {
  const [saving, setSaving] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState(
    restaurant.dishes.find((d) => d.arModelUrl)?.id ?? null
  );

  async function patchDish(dishId: string, patch: Partial<Dish>) {
    setSaving(dishId);
    try {
      const res = await fetch(
        `/api/restaurants/${restaurant.slug}/dishes/${dishId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        }
      );
      const data = await res.json();
      if (res.ok) onUpdate(data.restaurant);
    } finally {
      setSaving(null);
    }
  }

  function linkPolycamModel(dishId: string, fileName: string) {
    setPreviewId(dishId);
    patchDish(dishId, {
      arModelUrl: `/models/${fileName}`,
      arScale: dishId === "burger" ? 1 : dishId === "salmon" ? 1 : 0.8,
    });
  }

  const preview = restaurant.dishes.find((d) => d.id === previewId);

  return (
    <div className="space-y-6">
      <PolycamScanGuide />

      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <h3 className="font-semibold text-stone-900">
          Step 2 — Link scanned models
        </h3>
        <p className="mt-1 text-sm text-stone-600">
          After you drop .glb files in{" "}
          <code className="text-amber-800">public/models/</code>, tap to link
          them. Calories &amp; allergens show on the AR screen automatically.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {POLYCAM_DEMO_DISHES.map((d) => (
            <button
              key={d.id}
              type="button"
              disabled={saving === d.id}
              onClick={() => linkPolycamModel(d.id, d.fileName)}
              className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              Link {d.fileName}
            </button>
          ))}
        </div>
      </div>

      {preview?.arModelUrl && (
        <div>
          <h3 className="mb-2 font-semibold">Preview — {preview.name}</h3>
          <ARViewer
            src={preview.arModelUrl}
            alt={preview.name}
            poster={preview.imageUrl}
            scale={preview.arScale ?? 1}
            height={340}
            compact
            nutrition={{
              name: preview.name,
              calories: preview.calories,
              portion: preview.portion,
              allergens: preview.allergens,
            }}
          />
          <label className="mt-3 flex items-center gap-2 text-sm text-stone-600">
            Scale
            <input
              type="number"
              step="0.05"
              defaultValue={preview.arScale ?? 1}
              onBlur={(e) => {
                const s = parseFloat(e.target.value);
                if (!Number.isNaN(s) && s !== preview.arScale) {
                  patchDish(preview.id, { arScale: s });
                }
              }}
              className="w-24 rounded-lg border px-2 py-1"
            />
          </label>
        </div>
      )}

      {restaurant.dishes.map((dish) => {
        const polycam = POLYCAM_DEMO_DISHES.find((d) => d.id === dish.id);
        return (
          <div
            key={dish.id}
            className="rounded-2xl border border-stone-200 bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">{dish.name}</h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  dish.arModelUrl
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {dish.arModelUrl ? "AR linked" : "No model yet"}
              </span>
            </div>
            {polycam && (
              <p className="mt-2 text-xs text-stone-500">
                Expected file:{" "}
                <code className="text-amber-800">public/models/{polycam.fileName}</code>
              </p>
            )}
            {dish.arModelUrl && (
              <p className="mt-1 break-all text-xs text-stone-400">
                {dish.arModelUrl}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPreviewId(dish.id)}
                className="text-sm text-amber-700 underline"
              >
                Preview
              </button>
              {polycam && (
                <button
                  type="button"
                  disabled={saving === dish.id}
                  onClick={() => linkPolycamModel(dish.id, polycam.fileName)}
                  className="text-sm text-stone-700 underline"
                >
                  Link Polycam file
                </button>
              )}
              {dish.arModelUrl && (
                <button
                  type="button"
                  disabled={saving === dish.id}
                  onClick={() =>
                    patchDish(dish.id, { arModelUrl: null as unknown as string })
                  }
                  className="text-sm text-red-600 underline"
                >
                  Remove AR
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
