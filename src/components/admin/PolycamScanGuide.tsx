import { POLYCAM_DEMO_DISHES, POLYCAM_STEPS } from "@/lib/polycam-guide";

export function PolycamScanGuide() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
        Step 1 — Polycam scan (do this first)
      </p>
      <h3 className="mt-1 text-lg font-bold text-stone-900">
        Scan 3 demo dishes with your phone
      </h3>
      <p className="mt-2 text-sm text-stone-600">
        Best quality for London restaurant pitches. Free app — no AI guesswork.
      </p>

      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-stone-700">
        {POLYCAM_STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <div className="mt-5">
        <p className="text-sm font-semibold text-stone-900">
          Save each export as:
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {POLYCAM_DEMO_DISHES.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border border-amber-200 bg-white p-3"
            >
              <p className="font-medium text-stone-900">{d.name}</p>
              <code className="mt-1 block text-xs text-amber-800">
                public/models/{d.fileName}
              </code>
              <p className="mt-2 text-xs text-stone-500">{d.tips}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-stone-500">
        Download Polycam:{" "}
        <a
          href="https://poly.cam"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-amber-700 underline"
        >
          poly.cam
        </a>
        {" · "}
        Alternative free app: Scaniverse
      </p>
    </div>
  );
}
