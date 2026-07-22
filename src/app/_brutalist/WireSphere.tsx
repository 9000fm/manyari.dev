"use client";
import { useEffect, useRef } from "react";

/**
 * Rotating wireframe globe. Renders on the main thread, but its heavy module
 * (WebGL + ~140KB of geo data) is dynamic-imported one animation frame AFTER
 * mount, so those bytes stay OUT of the initial bundle (lower TBT) yet load
 * reliably right after first paint - requestAnimationFrame is guaranteed to
 * fire (unlike requestIdleCallback / interaction gating, which could leave the
 * globe blank). Drag to spin. Decorative -> aria-hidden. The canvas box is
 * reserved by `.identSphere` in the page CSS, so there is no layout shift.
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

  useEffect(() => {
    if (!ref.current) return;
    let cleanup = () => {};
    let cancelled = false;
    const raf = requestAnimationFrame(() => {
      import("./globeMainThread").then((m) => {
        if (!cancelled && ref.current) {
          cleanup = m.renderMainThread(ref.current, { size, tilt, speed });
        }
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [size, tilt, speed]);

  return (
    <canvas
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
