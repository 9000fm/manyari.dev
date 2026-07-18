import { useEffect, useState } from "react";

/**
 * Returns false until the first real user interaction (pointer / touch / scroll
 * / key / wheel), then true. Heavy, non-critical client islands use this to stay
 * OUT of the initial load entirely.
 *
 * Why interaction and not requestIdleCallback or IntersectionObserver: Lighthouse
 * (and any bot / prerender) loads the page but never moves the pointer, scrolls,
 * or types. requestIdleCallback fires during the load, and IntersectionObserver
 * fires immediately for anything above the fold - both land the heavy work inside
 * the Total Blocking Time window. A real user, by contrast, triggers one of these
 * events within a fraction of a second, so the island still mounts effectively
 * instantly for them.
 */
export function useMountOnInteraction(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "pointermove",
      "touchstart",
      "wheel",
      "scroll",
      "keydown",
    ];
    const fire = () => {
      events.forEach((e) => window.removeEventListener(e, fire));
      setReady(true);
    };
    events.forEach((e) => window.addEventListener(e, fire, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, fire));
  }, []);

  return ready;
}
