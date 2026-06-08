"use client";

import { useEffect, useRef, useState } from "react";
import {
  ARNutritionOverlay,
  type ARNutritionInfo,
} from "@/components/ARNutritionOverlay";

type Props = {
  src: string;
  alt: string;
  poster?: string;
  scale?: number;
  height?: number;
  compact?: boolean;
  nutrition?: ARNutritionInfo;
};

export function ARViewer({
  src,
  alt,
  poster,
  scale = 1,
  height = 380,
  compact = false,
  nutrition,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let viewer: HTMLElement | null = null;
    let cancelled = false;

    async function mountViewer() {
      setLoading(true);
      setError(false);

      try {
        await import("@google/model-viewer");
        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = "";
        viewer = document.createElement("model-viewer");

        viewer.setAttribute("src", src);
        viewer.setAttribute("alt", alt);
        if (poster) viewer.setAttribute("poster", poster);
        viewer.setAttribute("ar", "");
        viewer.setAttribute("ar-modes", "webxr scene-viewer quick-look");
        viewer.setAttribute("ar-placement", "floor");
        viewer.setAttribute("camera-controls", "");
        viewer.setAttribute("touch-action", "pan-y");
        viewer.setAttribute("auto-rotate", "");
        viewer.setAttribute("shadow-intensity", "1.2");
        viewer.setAttribute("exposure", "1.1");
        viewer.setAttribute("interaction-prompt", "auto");
        viewer.setAttribute("environment-image", "neutral");
        viewer.setAttribute("scale", `${scale} ${scale} ${scale}`);

        viewer.style.width = "100%";
        viewer.style.height = `${height}px`;
        viewer.style.background =
          "linear-gradient(180deg, #1c1917 0%, #292524 100%)";

        viewer.addEventListener("load", () => {
          if (!cancelled) setLoading(false);
        });
        viewer.addEventListener("error", () => {
          if (!cancelled) {
            setError(true);
            setLoading(false);
          }
        });

        containerRef.current.appendChild(viewer);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    mountViewer();

    return () => {
      cancelled = true;
      viewer?.remove();
    };
  }, [src, alt, poster, scale, height]);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-900">
      <div className="relative">
        <div ref={containerRef} />
        {nutrition && !error && <ARNutritionOverlay info={nutrition} />}
        {loading && !error && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-stone-900/80 text-sm text-stone-300"
            style={{ height }}
          >
            Loading 3D model…
          </div>
        )}
        {error && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-stone-900 px-6 text-center text-sm text-red-300"
            style={{ height }}
          >
            Could not load AR model. Check the model URL in admin.
          </div>
        )}
      </div>
      {!compact && (
        <div className="space-y-1 bg-stone-950 px-4 py-3 text-center text-xs text-stone-300">
          <p>
            Point your phone at the table and tap{" "}
            <span className="font-semibold text-amber-400">
              View in your space
            </span>
          </p>
          <p className="text-stone-500">
            Calories &amp; allergens stay visible as text while in AR
          </p>
        </div>
      )}
    </div>
  );
}
