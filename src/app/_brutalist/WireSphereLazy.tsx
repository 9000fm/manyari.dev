"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Client-only, code-split import. This pulls WireSphere + its ~140KB of Natural
// Earth geo data (coastline / landgrid / landfill) into a SEPARATE async chunk
// instead of the initial page bundle.
const WireSphere = dynamic(() => import("./WireSphere"), { ssr: false });

/**
 * Defers the decorative WebGL globe until the browser is idle, so parsing and
 * compiling its heavy chunk never blocks first paint or hydration (this is the
 * main lever on Total Blocking Time). The globe is decorative (aria-hidden).
 *
 * No layout shift: a blank, same-size canvas holds the exact box (it matches the
 * `.identSphere canvas` sizing rules, incl. the mobile !important override). We
 * only swap it for the real globe AFTER the chunk has fully loaded - the manual
 * import() below shares the same module the dynamic() call uses, so by the time
 * we flip `ready` the module is cached and the swap is instant (no empty gap).
 */
export default function WireSphereLazy({ size = 160 }: { size?: number }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      import("./WireSphere").then(() => {
        if (!cancelled) setReady(true);
      });
    };
    type IdleWin = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWin;
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(load, { timeout: 1500 });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }
    const id = window.setTimeout(load, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, []);

  if (ready) return <WireSphere size={size} />;
  return <canvas aria-hidden="true" style={{ width: size, height: size, display: "block" }} />;
}
