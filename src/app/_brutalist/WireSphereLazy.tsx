"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Client-only, code-split import. This pulls WireSphere + its ~140KB of Natural
// Earth geo data (coastline / landgrid / landfill) into a SEPARATE async chunk
// instead of the initial page bundle.
const WireSphere = dynamic(() => import("./WireSphere"), { ssr: false });

/**
 * The globe is the hero element, so it must load reliably and promptly - but it
 * is heavy, so we keep it out of the very first paint. It loads on whichever
 * comes first: the user's first interaction (instant), or a guaranteed ~600ms
 * idle/timeout fallback (so it ALWAYS appears even with zero interaction). A
 * failed chunk fetch retries once. No layout shift: a blank same-size canvas
 * holds the exact box (matching the `.identSphere canvas` sizing rules, incl.
 * the mobile !important override), and we only swap in the real globe once its
 * chunk has fully loaded, so the swap is instant.
 */
export default function WireSphereLazy({ size = 160 }: { size?: number }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let started = false;
    let idleId: number | null = null;
    let timer = 0;
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "pointermove",
      "touchstart",
      "wheel",
      "scroll",
      "keydown",
    ];
    type IdleWin = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWin;

    function removeAll() {
      events.forEach((e) => window.removeEventListener(e, start));
      if (idleId != null) w.cancelIdleCallback?.(idleId);
      clearTimeout(timer);
    }
    function attempt(retry: boolean) {
      import("./WireSphere")
        .then(() => {
          if (!cancelled) setReady(true);
        })
        .catch(() => {
          if (!cancelled && retry) window.setTimeout(() => attempt(false), 400);
        });
    }
    function start() {
      if (started || cancelled) return;
      started = true;
      removeAll();
      attempt(true);
    }

    events.forEach((e) => window.addEventListener(e, start, { passive: true }));
    idleId = typeof w.requestIdleCallback === "function" ? w.requestIdleCallback(start, { timeout: 600 }) : null;
    timer = window.setTimeout(start, 600);

    return () => {
      cancelled = true;
      removeAll();
    };
  }, []);

  if (ready) return <WireSphere size={size} />;
  return <canvas aria-hidden="true" style={{ width: size, height: size, display: "block" }} />;
}
