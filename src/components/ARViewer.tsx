"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  alt: string;
  poster?: string;
};

export function ARViewer({ src, alt, poster }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let viewer: HTMLElement | null = null;

    async function mountViewer() {
      await import("@google/model-viewer");
      if (!containerRef.current) return;

      containerRef.current.innerHTML = "";
      viewer = document.createElement("model-viewer");
      viewer.setAttribute("src", src);
      viewer.setAttribute("alt", alt);
      if (poster) viewer.setAttribute("poster", poster);
      viewer.setAttribute("ar", "");
      viewer.setAttribute("ar-modes", "webxr scene-viewer quick-look");
      viewer.setAttribute("camera-controls", "");
      viewer.setAttribute("touch-action", "pan-y");
      viewer.setAttribute("auto-rotate", "");
      viewer.setAttribute("shadow-intensity", "1");
      viewer.setAttribute("exposure", "1");
      viewer.style.width = "100%";
      viewer.style.height = "320px";
      containerRef.current.appendChild(viewer);
    }

    mountViewer();

    return () => {
      viewer?.remove();
    };
  }, [src, alt, poster]);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-900">
      <div ref={containerRef} />
      <p className="bg-stone-950 px-4 py-3 text-center text-xs text-stone-300">
        Point your phone at the table and tap{" "}
        <span className="font-semibold text-white">View in AR</span> to place
        the dish
      </p>
    </div>
  );
}
