"use client";

import Link from "next/link";
import { useState } from "react";
import { ARManager } from "@/components/admin/ARManager";
import { MenuEditor } from "@/components/admin/MenuEditor";
import { QRPanel } from "@/components/admin/QRPanel";
import type { Restaurant } from "@/lib/types";

export function AdminDashboard({ initialRestaurant, baseUrl }: { initialRestaurant: Restaurant; baseUrl: string }) {
  const [restaurant, setRestaurant] = useState(initialRestaurant);
  const [tab, setTab] = useState<"menu" | "qr" | "ar">("menu");

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-600">TableMenu Admin</p>
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          </div>
          <Link href={`/r/${restaurant.slug}/t/1`} className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white">View live menu</Link>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 px-4">
          {(["menu", "qr", "ar"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-t-lg px-5 py-3 text-sm font-medium capitalize ${tab === t ? "bg-stone-100" : "text-stone-500"}`}>{t === "qr" ? "QR codes" : t === "ar" ? "AR models" : "Menu"}</button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        {tab === "menu" && <MenuEditor restaurant={restaurant} onUpdate={setRestaurant} />}
        {tab === "qr" && <QRPanel restaurant={restaurant} baseUrl={baseUrl} />}
        {tab === "ar" && <ARManager restaurant={restaurant} onUpdate={setRestaurant} />}
      </main>
    </div>
  );
}
