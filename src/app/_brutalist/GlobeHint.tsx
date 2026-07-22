"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Small "drag to spin" caption over the globe, hinting the drag interaction.
 * Shows on load, then fades out after a few seconds OR on the first pointer-down
 * anywhere in the sphere box (whichever comes first). Sits inside `.identSphere`
 * (which is position:relative); the caption itself is pointer-events:none so it
 * never blocks the drag. Decorative, so it's aria-hidden.
 */
export default function GlobeHint() {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const box = ref.current?.parentElement; // .identSphere
    const hide = () => setOn(false);
    const t = window.setTimeout(hide, 4000);
    box?.addEventListener("pointerdown", hide, { once: true });
    return () => {
      window.clearTimeout(t);
      box?.removeEventListener("pointerdown", hide);
    };
  }, []);

  return (
    <span ref={ref} className="globeHint" data-on={on} aria-hidden="true">
      drag to spin
    </span>
  );
}
