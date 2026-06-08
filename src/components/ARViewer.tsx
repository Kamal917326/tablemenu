"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  allergenLabelText,
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

function addHotspots(viewer: HTMLElement, nutrition: ARNutritionInfo) {
  const calories = document.createElement("button");
  calories.setAttribute("slot", "hotspot-calories");
  calories.setAttribute("data-position", "0m 0.12m 0m");
  calories.setAttribute("data-normal", "0m 1m 0m");
  calories.className = "ar-hotspot-btn";
  calories.innerHTML = `<div class="ar-hotspot-label">${nutrition.calories} kcal</div>`;
  viewer.appendChild(calories);

  const allergens = document.createElement("button");
  allergens.setAttribute("slot", "hotspot-allergens");
  allergens.setAttribute("data-position", "0m 0.18m 0m");
  allergens.setAttribute("data-normal", "0m 1m 0m");
  allergens.className = "ar-hotspot-btn";
  allergens.innerHTML = `<div class="ar-hotspot-label ar-hotspot-allergens">${allergenLabelText(nutrition.allergens)}</div>`;
  viewer.appendChild(allergens);
}

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
  const [inAR, setInAR] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let viewer: HTMLElement | null = null;
    let cancelled = false;

    async function mountViewer() {
      setLoading(true);
      setError(false);
      setInAR(false);

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

        if (nutrition) {
          addHotspots(viewer, nutrition);
        }

        viewer.addEventListener("load", () => {
          if (!cancelled) setLoading(false);
        });
        viewer.addEventListener("error", () => {
          if (!cancelled) {
            setError(true);
            setLoading(false);
          }
        });
        viewer.addEventListener("ar-status", (event) => {
          const detail = (event as CustomEvent).detail as {
            status?: string;
          };
          const active =
            detail.status === "session-started" ||
            detail.status === "object-placed";
          if (!cancelled) setInAR(active);
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
      setInAR(false);
      viewer?.remove();
    };
  }, [src, alt, poster, scale, height, nutrition]);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-900">
        <div className="relative">
          <div ref={containerRef} />
          {nutrition && !error && (
            <ARNutritionOverlay info={nutrition} variant="bottom" />
          )}
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
              Could not load AR model. Add your .glb file to public/models/
            </div>
          )}
        </div>
        {!compact && (
          <div className="space-y-1 bg-stone-950 px-4 py-3 text-center text-xs text-stone-300">
            <p className="text-stone-400">
              Tap View in your space — plain text shows calories and allergens
            </p>
          </div>
        )}
      </div>

      {mounted &&
        inAR &&
        nutrition &&
        createPortal(
          <ARNutritionOverlay info={nutrition} variant="ar-hud" />,
          document.body
        )}
    </>
  );
}
