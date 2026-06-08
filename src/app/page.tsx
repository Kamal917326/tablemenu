import Link from "next/link";
import { demoRestaurant } from "@/lib/data";

export default function HomePage() {
  const demoUrl = `/r/${demoRestaurant.slug}/t/1`;

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-400">
          TableMenu
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
          Scan. Browse. See your dish on the table — no app download.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-stone-300">
          QR-powered web menus for London restaurants. Allergen filters, live
          updates, and optional AR previews for signature dishes.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href={demoUrl}
            className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-4 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
          >
            Open demo menu (Table 1)
          </Link>
          <Link
            href="/admin/copper-pot"
            className="inline-flex items-center justify-center rounded-full border border-stone-700 px-8 py-4 text-sm font-semibold text-white transition hover:border-stone-500"
          >
            Restaurant admin
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "No app needed",
              body: "Guests scan a QR code and get your menu instantly in the browser.",
            },
            {
              title: "UK allergen ready",
              body: "Filter by the 14 major allergens. Clear labels on every dish.",
            },
            {
              title: "AR menu",
              body: "Tap a dish and view a 3D preview on the table through the phone camera.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5"
            >
              <h2 className="font-semibold text-amber-300">{item.title}</h2>
              <p className="mt-2 text-sm text-stone-400">{item.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-xs text-stone-500">
          MVP demo · {demoRestaurant.name} · London
        </p>
      </div>
    </div>
  );
}
