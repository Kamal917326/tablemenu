import Link from "next/link";
import { demoRestaurant } from "@/lib/data";

export default function AdminPreviewPage() {
  return (
    <div className="min-h-screen bg-stone-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-600">
          Coming soon
        </p>
        <h1 className="mt-2 text-2xl font-bold text-stone-900">
          Restaurant dashboard
        </h1>
        <p className="mt-3 text-stone-600">
          Edit menus, mark dishes sold out, generate table QR codes, and upload
          AR models. This admin panel is the next build milestone.
        </p>

        <ul className="mt-6 space-y-2 text-sm text-stone-700">
          <li>• Menu editor with categories and pricing</li>
          <li>• Per-table QR code generator (print-ready)</li>
          <li>• Allergen and calorie fields per dish</li>
          <li>• AR model upload for signature dishes</li>
          <li>• Basic analytics (views, AR opens)</li>
        </ul>

        <Link
          href={`/r/${demoRestaurant.slug}/t/1`}
          className="mt-8 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white"
        >
          View live demo menu →
        </Link>
      </div>
    </div>
  );
}
