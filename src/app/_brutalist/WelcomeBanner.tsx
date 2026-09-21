"use client";
import { useEffect, useRef, useState } from "react";
import { UI_ES } from "@/content.es";
import { BANNER } from "@/content";

// Availability notice. Shows on every load; the × dismisses it for the current
// view only (no persistence) - reloading brings it back.
//
// Leaving is a CSS-only collapse: the wrapper animates grid-template-rows
// 1fr -> 0fr while the notice fades, so the page below glides up instead of
// snapping. We unmount on a timer rather than transitionend, because under
// prefers-reduced-motion the duration is 0 and transitionend never fires.
// must stay >= the longest leave transition in the page CSS (0.42s collapse)
const LEAVE_MS = 440;

export default function WelcomeBanner() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  if (gone) return null;

  return (
    <div className={leaving ? "welcomeWrap isLeaving" : "welcomeWrap"} aria-hidden={leaving}>
      <div className="welcomeInner">
        <div className="welcome">
          <button
            className="welcomeX"
            aria-label="Dismiss notice"
            onClick={() => {
              setLeaving(true);
              timer.current = setTimeout(() => setGone(true), LEAVE_MS);
            }}
          >
            ×
          </button>
          {/* Split into spans so each run of text is its own element: the
              language switch swaps textContent per [data-es] node, and a bare
              text node between two links cannot carry the attribute. */}
          <p className="welcomeText">
            <b data-es={UI_ES.bannerLead}>{BANNER.lead}</b>{" "}
            <span data-es={UI_ES.bannerRest1}>
              {BANNER.beforeWork}
            </span>{" "}
            <a href="#work" data-es={UI_ES.bannerWork}>{BANNER.work}</a>
            <span data-es={UI_ES.bannerRest2}>{BANNER.betweenLinks}</span>{" "}
            <a href="#contact" data-es={UI_ES.bannerContact}>{BANNER.contact}</a>
            <span data-es={UI_ES.bannerEnd}>{BANNER.end}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
