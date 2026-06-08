"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { UK_ALLERGENS, type Allergen, type Dish, type Restaurant } from "@/lib/types";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  imageUrl: "",
  calories: "",
  portion: "",
  ingredients: "",
  allergens: [] as Allergen[],
};

export function MenuEditor({
  restaurant,
  onUpdate,
}: {
  restaurant: Restaurant;
  onUpdate: (r: Restaurant) => void;
}) {
  const [saving, setSaving] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const defaultCategory = restaurant.categories[0]?.id ?? "";

  async function patchDish(dishId: string, patch: Partial<Dish>) {
    setSaving(dishId);
    setError("");
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
      else setError(data.error ?? "Save failed");
    } finally {
      setSaving(null);
    }
  }

  async function removeDish(dish: Dish) {
    if (!confirm(`Delete "${dish.name}" from the menu?`)) return;
    setSaving(dish.id);
    setError("");
    try {
      const res = await fetch(
        `/api/restaurants/${restaurant.slug}/dishes/${dish.id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) onUpdate(data.restaurant);
      else setError(data.error ?? "Delete failed");
    } finally {
      setSaving(null);
    }
  }

  async function submitNewDish(e: React.FormEvent) {
    e.preventDefault();
    setSaving("new");
    setError("");

    const pricePence = Math.round(parseFloat(form.price) * 100);
    if (!form.name.trim() || !form.categoryId || Number.isNaN(pricePence)) {
      setError("Name, category, and price are required");
      setSaving(null);
      return;
    }

    try {
      const res = await fetch(`/api/restaurants/${restaurant.slug}/dishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          pricePence,
          categoryId: form.categoryId,
          imageUrl: form.imageUrl || undefined,
          calories: form.calories ? parseInt(form.calories, 10) : 0,
          portion: form.portion,
          ingredients: form.ingredients
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          allergens: form.allergens,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onUpdate(data.restaurant);
        setForm({ ...emptyForm, categoryId: defaultCategory });
        setShowAdd(false);
      } else {
        setError(data.error ?? "Could not add dish");
      }
    } finally {
      setSaving(null);
    }
  }

  function toggleAllergen(a: Allergen) {
    setForm((f) => ({
      ...f,
      allergens: f.allergens.includes(a)
        ? f.allergens.filter((x) => x !== a)
        : [...f.allergens, a],
    }));
  }

  const byCategory = [...restaurant.categories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((cat) => ({
      category: cat,
      dishes: restaurant.dishes.filter((d) => d.categoryId === cat.id),
    }));

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-stone-900">Dishes</h2>
          <button
            type="button"
            onClick={() => {
              setShowAdd(!showAdd);
              setForm((f) => ({
                ...emptyForm,
                categoryId: f.categoryId || defaultCategory,
              }));
            }}
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white"
          >
            {showAdd ? "Cancel" : "+ Add dish"}
          </button>
        </div>

        {showAdd && (
          <form onSubmit={submitNewDish} className="mt-5 space-y-4 border-t pt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-stone-700">Name *</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="Fish and chips"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-stone-700">Category *</span>
                <select
                  required
                  value={form.categoryId || defaultCategory}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                >
                  {restaurant.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-medium text-stone-700">Price (£) *</span>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="12.95"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-stone-700">Calories</span>
                <input
                  type="number"
                  value={form.calories}
                  onChange={(e) =>
                    setForm({ ...form, calories: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="650"
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="font-medium text-stone-700">Description</span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-stone-700">Portion</span>
                <input
                  value={form.portion}
                  onChange={(e) => setForm({ ...form, portion: e.target.value })}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="300g serving"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-stone-700">Image URL</span>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="https://..."
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="font-medium text-stone-700">
                Ingredients (comma-separated)
              </span>
              <input
                value={form.ingredients}
                onChange={(e) =>
                  setForm({ ...form, ingredients: e.target.value })
                }
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="potato, cod, flour, oil"
              />
            </label>
            <div>
              <p className="text-sm font-medium text-stone-700">Allergens</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {UK_ALLERGENS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAllergen(a)}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      form.allergens.includes(a)
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-300 text-stone-600"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={saving === "new"}
              className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving === "new" ? "Adding…" : "Add to menu"}
            </button>
          </form>
        )}
      </div>

      {byCategory.map(({ category, dishes }) => (
        <div key={category.id}>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
            {category.name}
          </h3>
          <div className="space-y-3">
            {dishes.length === 0 && (
              <p className="text-sm text-stone-400">No dishes in this category.</p>
            )}
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-stone-900">{dish.name}</h4>
                    <p className="mt-1 text-sm text-stone-500">{dish.description}</p>
                    <p className="mt-1 text-xs text-stone-400">ID: {dish.id}</p>
                  </div>
                  <span className="font-semibold text-stone-900">
                    {formatPrice(dish.pricePence)}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={saving === dish.id}
                    onClick={() =>
                      patchDish(dish.id, { soldOut: !dish.soldOut })
                    }
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      dish.soldOut
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {saving === dish.id
                      ? "Saving…"
                      : dish.soldOut
                        ? "Mark available"
                        : "Mark sold out"}
                  </button>
                  <label className="flex items-center gap-2 text-sm text-stone-600">
                    Price (£)
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={(dish.pricePence / 100).toFixed(2)}
                      onBlur={(e) => {
                        const pence = Math.round(parseFloat(e.target.value) * 100);
                        if (!Number.isNaN(pence) && pence !== dish.pricePence) {
                          patchDish(dish.id, { pricePence: pence });
                        }
                      }}
                      className="w-24 rounded-lg border px-2 py-1"
                    />
                  </label>
                  <button
                    type="button"
                    disabled={saving === dish.id}
                    onClick={() => removeDish(dish)}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
