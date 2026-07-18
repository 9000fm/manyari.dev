"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Code-split, client-only. The Selected Work hover/tap preview is a pure
// interaction layer (a fixed, hidden card) - nothing renders until a user
// hovers or taps a row, so it has no place in the critical render path.
const WorkHover = dynamic(() => import("./WorkHover"), { ssr: false });

/**
 * Mounts WorkHover once the browser is idle. Keeps its JS + listener setup off
 * the first-paint / hydration path (helps Total Blocking Time). The card is
 * `position: fixed` and starts hidden, so deferring it causes no layout shift;
 * the only effect is that previews arm a fraction of a second after load.
 */
export default function WorkHoverLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    type IdleWin = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWin;
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setReady(true), 300);
    return () => clearTimeout(id);
  }, []);

  return ready ? <WorkHover /> : null;
}
