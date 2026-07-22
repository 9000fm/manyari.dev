"use client";
import { useEffect } from "react";

/**
 * Weighted (lerp) wheel scrolling for desktop - the page eases toward the wheel
 * target with a bit of inertia, instead of jumping. Subtle by design.
 *
 * Scope + safety:
 * - Only mouse/trackpad WHEEL is smoothed. Touch devices fire no wheel events,
 *   so mobile keeps its native (OS-level) momentum scroll untouched.
 * - Disabled entirely under prefers-reduced-motion and on coarse pointers.
 * - Keyboard / scrollbar / anchor-jump scrolling is left native; a scroll
 *   listener resyncs our target whenever we're not the one driving, so those
 *   never fight the lerp or yank the page back.
 * - We set scroll-behavior:auto while active so our per-frame scrollTo isn't
 *   double-smoothed by the CSS smooth-scroll (anchor links pass an explicit
 *   behavior:'smooth', so they still animate - see SmoothScroll).
 */
export default function SmoothWheel() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    // fraction of the remaining distance covered each frame.
    // lower = heavier / more inertia ("kinda harder"); higher = snappier.
    const EASE = 0.085;

    const docEl = document.documentElement;
    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;
    let running = false;

    const prevBehavior = docEl.style.scrollBehavior;
    docEl.style.scrollBehavior = "auto";

    const maxScroll = () => docEl.scrollHeight - window.innerHeight;

    const frame = () => {
      const d = target - current;
      if (Math.abs(d) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        running = false;
        return;
      }
      current += d * EASE;
      window.scrollTo(0, current);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // don't hijack pinch-zoom
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16; // lines -> px
      else if (e.deltaMode === 2) delta *= window.innerHeight; // pages -> px
      e.preventDefault();
      target = Math.max(0, Math.min(target + delta, maxScroll()));
      start();
    };

    // resync when scrolling comes from anything but our lerp (keyboard, scrollbar
    // drag, smooth anchor jumps) so we follow instead of fighting it
    const onScroll = () => {
      if (!running) {
        current = window.scrollY;
        target = current;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      docEl.style.scrollBehavior = prevBehavior;
    };
  }, []);

  return null;
}
