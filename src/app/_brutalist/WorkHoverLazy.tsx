"use client";
import WorkHover from "./WorkHover";

// The interaction itself is tiny; media is mounted only when a preview opens.
// No hydration-time dynamic import delay on the first click or tap.
export default function WorkHoverLazy() {
  return <WorkHover />;
}
