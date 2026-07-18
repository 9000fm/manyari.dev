"use client";
import { useRef, useEffect } from "react";
import type { ReactElement } from "react";
import { ME, TICKER } from "@/content";

/**
 * Seamless infinite ticker that eases to a stop on hover and eases back
 * (digeart-style), driven by the Web Animations API so playbackRate can
 * animate smoothly. Client island; the rest of the page stays server-rendered.
 */
export default function Ticker(): ReactElement {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anim = track.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
      { duration: 105000, iterations: Infinity, easing: "linear" },
    );
    animRef.current = anim;
    return () => {
      anim.cancel();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Ease playbackRate toward a target (1 = full speed, 0 = stopped).
  const easeTo = (target: number) => {
    const anim = animRef.current;
    if (!anim) return;
    cancelAnimationFrame(rafRef.current);
    const start = anim.playbackRate;
    const t0 = performance.now();
    const dur = 700;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOut
      anim.playbackRate = start + (target - start) * e;
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const tags = [ME.role, ...TICKER];
  const unit = (rk: string) => (
    <span key={rk}>
      {tags.map((t, i) => (
        <span key={i}>{t}<span className="brutMarqSep">•</span></span>
      ))}
      <a href="#contact">Available now</a>
      <span className="brutMarqSep">•</span>
    </span>
  );

  return (
    <div className="brutMarq" onMouseEnter={() => easeTo(0)} onMouseLeave={() => easeTo(1)}>
      <div className="brutMarqTrack" style={{ animation: "none" }} ref={trackRef}>
        {[0, 1, 2, 3].map((n) => unit(`a${n}`))}
        {[0, 1, 2, 3].map((n) => unit(`b${n}`))}
      </div>
    </div>
  );
}
