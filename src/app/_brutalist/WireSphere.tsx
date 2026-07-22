"use client";
import { useEffect, useRef } from "react";
import { renderMainThread } from "./globeMainThread";

/**
 * Rotating wireframe globe. Renders directly on the main thread and eagerly on
 * mount, so it shows up reliably on every load / reload (no worker, no watchdog,
 * no fallback chain - those added flakiness where the globe could come up blank).
 * Drag to spin. Decorative -> aria-hidden. The canvas box is reserved by
 * `.identSphere` in the page CSS, so there is no layout shift.
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
    const canvas = ref.current;
    if (!canvas) return;
    return renderMainThread(canvas, { size, tilt, speed });
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
