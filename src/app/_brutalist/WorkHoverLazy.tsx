"use client";
import dynamic from "next/dynamic";
import { useMountOnInteraction } from "./useMountOnInteraction";

// Code-split, client-only. The Selected Work hover/tap preview is a pure
// interaction layer (a fixed, hidden card) - nothing renders until a user
// hovers or taps a row, so it has no place in the critical render path.
const WorkHover = dynamic(() => import("./WorkHover"), { ssr: false });

/**
 * Mounts WorkHover on the first user interaction (pointer / touch / scroll), so
 * its JS + listener setup never runs during a non-interactive load (Lighthouse,
 * prerender). By the time a user actually hovers a Work row they've already moved
 * the pointer into the page, so it's armed. The card is `position: fixed` and
 * starts hidden, so deferring it causes no layout shift.
 */
export default function WorkHoverLazy() {
  const ready = useMountOnInteraction();
  return ready ? <WorkHover /> : null;
}
