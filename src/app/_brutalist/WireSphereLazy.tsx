"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMountOnInteraction } from "./useMountOnInteraction";

// Client-only, code-split import. This pulls WireSphere + its ~140KB of Natural
// Earth geo data (coastline / landgrid / landfill) into a SEPARATE async chunk
// instead of the initial page bundle.
const WireSphere = dynamic(() => import("./WireSphere"), { ssr: false });

/**
 * Holds the decorative WebGL globe out of the initial load until the first user
 * interaction, so its heavy chunk never parses/compiles inside the Total
 * Blocking Time window (the globe is above the fold, so IntersectionObserver /
 * idle callbacks would fire during the load - see useMountOnInteraction).
 *
 * No layout shift: a blank, same-size canvas holds the exact box (matching the
 * `.identSphere canvas` sizing rules, incl. the mobile !important override). We
 * only swap in the real globe AFTER its chunk has fully loaded - the manual
 * import() below shares the module dynamic() uses, so the swap is instant.
 */
export default function WireSphereLazy({ size = 160 }: { size?: number }) {
  const interacted = useMountOnInteraction();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!interacted) return;
    let cancelled = false;
    import("./WireSphere").then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [interacted]);

  if (ready) return <WireSphere size={size} />;
  return <canvas aria-hidden="true" style={{ width: size, height: size, display: "block" }} />;
}
