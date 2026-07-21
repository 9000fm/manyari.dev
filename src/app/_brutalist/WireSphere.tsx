"use client";
import { useEffect, useRef, useState } from "react";
import { createDragHandler } from "./globeDrag";

/**
 * Rotating wireframe globe. Renders in a Web Worker via OffscreenCanvas so the
 * ~140KB geo parse + WebGL work stay OFF the main thread (low Total Blocking
 * Time) while still loading eagerly and reliably. Browsers without OffscreenCanvas
 * (or any worker failure) fall back to an equivalent main-thread render, loaded
 * on demand via dynamic import so its geo data never enters the initial bundle.
 *
 * The space for this canvas is reserved by `.identSphere` in the page CSS, so
 * nothing here causes layout shift. Decorative -> aria-hidden.
 */
export default function WireSphere({
  size = 160,
  tilt = 0.5,
  lean = -14, // CSS roll in degrees - the Wikipedia globe's leftward lean
  speed = 0.00243,
}: {
  size?: number;
  tilt?: number;
  lean?: number;
  speed?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const supported =
      typeof OffscreenCanvas !== "undefined" &&
      typeof Worker !== "undefined" &&
      typeof canvas.transferControlToOffscreen === "function";

    // main-thread fallback (dynamic import keeps its geo data out of the initial bundle)
    if (fallback || !supported) {
      let cleanup = () => {};
      let cancelled = false;
      import("./globeMainThread").then((m) => {
        const el = ref.current;
        if (!cancelled && el) cleanup = m.renderMainThread(el, { size, tilt, speed });
      });
      return () => {
        cancelled = true;
        cleanup();
      };
    }

    // worker path
    let worker: Worker;
    try {
      worker = new Worker(new URL("./wireSphere.worker.ts", import.meta.url));
    } catch {
      setFallback(true);
      return;
    }

    // if the worker never confirms it rendered (silent failure, load error,
    // unsupported webgl-in-worker), fall back to the main-thread render
    let ready = false;
    const toFallback = () => {
      window.clearTimeout(watchdog);
      worker.terminate();
      setFallback(true);
    };
    const watchdog = window.setTimeout(() => {
      if (!ready) toFallback();
    }, 1500);

    worker.onmessage = (e: MessageEvent) => {
      const t = (e.data as { type?: string })?.type;
      if (t === "ready") {
        ready = true;
        window.clearTimeout(watchdog);
      } else if (t === "fail") {
        toFallback();
      }
    };
    worker.onerror = () => toFallback();

    try {
      const off = canvas.transferControlToOffscreen();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      worker.postMessage({ type: "init", canvas: off, size, dpr, tilt, speed, reduce }, [off]);
    } catch {
      toFallback();
      return;
    }

    // drag to spin - the element still receives pointer events even though its
    // drawing context was transferred to the worker
    const detach = createDragHandler(canvas, {
      onDragStart: () => worker.postMessage({ type: "dragStart" }),
      onDrag: (dTheta) => worker.postMessage({ type: "drag", dTheta }),
      onDragEnd: (flingVel) => worker.postMessage({ type: "dragEnd", vel: flingVel }),
    });

    return () => {
      window.clearTimeout(watchdog);
      detach();
      worker.terminate();
    };
  }, [size, tilt, speed, fallback]);

  return (
    <canvas
      key={fallback ? "fb" : "wk"}
      ref={ref}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        display: "block",
        cursor: "grab",
        transform: `rotate(${lean}deg)`,
        touchAction: "none",
      }}
    />
  );
}
