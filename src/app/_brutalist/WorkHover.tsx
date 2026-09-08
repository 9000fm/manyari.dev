"use client";
import { useEffect, useRef, useState } from "react";
import { PROJECTS, type Project } from "@/content";

/**
 * Preview for Selected Work (proof-of-work) - just the media, in a border.
 *
 * DESKTOP: hover a project row -> a bordered preview grows in and TRAILS the
 * cursor (eased, side-locked so it never flips mid-hover); shrinks out on leave.
 * MOBILE: tap a row's TEXT -> the preview grows in centered over a backdrop;
 * tap the card or backdrop to dismiss. Tapping the blue TITLE link navigates
 * to the site (the browser's own leave-site step). While hidden the card must
 * NOT capture taps, or it silently blocks the nav / Contents at screen centre.
 *
 * SCAFFOLD STAGE: rows without an asset show a "▶ preview" placeholder. To go
 * live, drop a GIF / clip / screenshot into /public/previews/<slug>.(gif|mp4|webp)
 * and register it in PREVIEWS below - no other change needed. Queries the
 * existing `.brutWork > li` markup, so shared markup stays untouched. Respects
 * prefers-reduced-motion.
 */

type Preview = { type: "video" | "image"; src: string; poster?: string };

// Real assets, keyed by project slug. Missing slug => placeholder card.
// Stepped-slideshow MP4s of the live sites (re-encoded from the source GIFs:
// ~70% smaller, and the poster doubles as the reduced-motion static frame).
const PREVIEWS: Record<string, Preview> = {
  tonydecay:  { type: "video", src: "/previews/tonydecay.mp4",  poster: "/previews/tonydecay.jpg" },
  silverback: { type: "video", src: "/previews/silverback.mp4", poster: "/previews/silverback.jpg" },
  superself:  { type: "video", src: "/previews/superself.mp4",  poster: "/previews/superself.jpg" },
  micaela:    { type: "video", src: "/previews/micaela.mp4",    poster: "/previews/micaela.jpg" },
  digeart:    { type: "video", src: "/previews/digeart.mp4",    poster: "/previews/digeart.jpg" },
};

export default function WorkHover() {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);
  const closeRef = useRef<() => void>(() => {});
  const [active, setActive] = useState<Project | null>(null); // current row (content)
  const [shown, setShown] = useState(false); // visibility (drives grow/shrink)
  const [touch, setTouch] = useState(false); // tap mode vs cursor-follow
  // reduced motion as state for render (autoPlay), the ref stays for the rAF paths
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(reduceRef.current);
    setTouch(!fine);

    const items = Array.from(
      document.querySelectorAll<HTMLLIElement>(".brutWork > li")
    );
    // map each work row to its project by matching the link href to PROJECTS.url
    const byLi = new Map<HTMLLIElement, Project>();
    for (const li of items) {
      const href = li.querySelector("a")?.getAttribute("href");
      const proj = href ? PROJECTS.find((p) => p.url === href) : undefined;
      if (proj) byLi.set(li, proj);
    }
    if (!byLi.size) return;

    const cleanups: Array<() => void> = [];

    // Escape always dismisses the peek (WCAG 1.4.13), in both modes
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", onKey);
    cleanups.push(() => document.removeEventListener("keydown", onKey));

    // ---------- MOBILE: tap the row TEXT to peek; the blue title link navigates ----------
    if (!fine) {
      closeRef.current = () => setShown(false);
      for (const [li, proj] of byLi) {
        const onClick = (e: Event) => {
          // tapping the blue title (or any link) leaves the site - let it be
          if ((e.target as HTMLElement | null)?.closest?.("a")) return;
          // tapping the text opens the preview
          e.preventDefault();
          setActive(proj);
          setShown(true);
        };
        li.addEventListener("click", onClick);
        cleanups.push(() => li.removeEventListener("click", onClick));
      }
      return () => cleanups.forEach((c) => c());
    }

    // ---------- DESKTOP: cursor-following preview ----------
    const GAP = 22;
    const PAD = 16;
    const EASE = 0.2; // trailing-follow factor (lower = lazier)
    let tx = 0, ty = 0; // target = cursor
    let cx = 0, cy = 0; // current = eased position
    let sideRight = true; // side of cursor, locked per hover
    let visible = false;
    let raf = 0;
    let hideTimer = 0;
    let hasCursor = false; // no hit-testing until the mouse has really moved
    let scrollRaf = 0;
    closeRef.current = () => {
      visible = false;
      setShown(false);
    };

    const apply = () => {
      const card = cardRef.current;
      if (!card) return;
      const w = card.offsetWidth || 480;
      const h = card.offsetHeight || 300;
      let x = sideRight ? cx + GAP : cx - GAP - w;
      x = Math.max(PAD, Math.min(x, window.innerWidth - w - PAD));
      const y = Math.max(PAD, Math.min(cy - h / 2, window.innerHeight - h - PAD));
      card.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    };

    const loop = () => {
      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      apply();
      if (visible && Math.abs(tx - cx) + Math.abs(ty - cy) > 0.4) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      hasCursor = true;
      tx = e.clientX;
      ty = e.clientY;
      if (reduceRef.current) {
        cx = tx;
        cy = ty;
        apply();
      } else {
        kick();
      }
    };

    const openAt = (proj: Project) => {
      // fresh appear: snap to cursor + lock side so it never flips mid-hover.
      // moving between rows (already visible): glide instead of teleport.
      if (!visible) {
        cx = tx;
        cy = ty;
        const w = cardRef.current?.offsetWidth || 480;
        sideRight = tx + GAP + w + PAD <= window.innerWidth;
      }
      visible = true;
      setActive(proj);
      setShown(true);
      if (reduceRef.current) apply();
      else kick();
    };

    for (const [li, proj] of byLi) {
      const enter = (e: MouseEvent) => {
        hasCursor = true;
        window.clearTimeout(hideTimer);
        tx = e.clientX;
        ty = e.clientY;
        openAt(proj);
      };
      const leave = () => {
        // small delay so crossing the gap between rows doesn't blink
        window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(() => {
          visible = false;
          setShown(false);
        }, 90);
      };
      li.addEventListener("mouseenter", enter);
      li.addEventListener("mousemove", onMove);
      li.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        li.removeEventListener("mouseenter", enter);
        li.removeEventListener("mousemove", onMove);
        li.removeEventListener("mouseleave", leave);
      });
    }

    // Re-sync on scroll. Chrome refires enter/leave while content scrolls under
    // a static cursor; Firefox and Safari do not, which left the card stuck
    // with a stale project. Hit-test the last cursor spot ourselves so all
    // three behave the same: swap to the row now under the cursor, or close.
    const onScroll = () => {
      if (!hasCursor || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const li = document.elementFromPoint(tx, ty)?.closest?.(".brutWork > li");
        const proj = li ? byLi.get(li as HTMLLIElement) : undefined;
        if (proj) {
          window.clearTimeout(hideTimer);
          openAt(proj);
        } else if (visible) {
          visible = false;
          setShown(false);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf);
    });

    return () => {
      window.clearTimeout(hideTimer);
      cancelAnimationFrame(raf);
      cleanups.forEach((c) => c());
    };
  }, []);

  // while the mobile peek is up, the page must not scroll under the backdrop.
  // iOS Safari can rubber-band straight past body overflow:hidden, so the
  // touchmove gesture itself is blocked too (non-passive on purpose; nothing
  // inside the card scrolls, so swallowing the gesture costs nothing).
  useEffect(() => {
    if (!(touch && shown)) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const block = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", block, { passive: false });
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("touchmove", block);
    };
  }, [touch, shown]);

  const preview = active ? PREVIEWS[active.slug] : undefined;

  // on mobile the peek is dismiss-only; navigation happens via the blue title
  const onCardTap = () => {
    if (touch) closeRef.current();
  };

  return (
    <>
      <style>{CSS}</style>
      {touch && shown && (
        <div
          className="workHoverBackdrop"
          role="button"
          aria-label="Close preview"
          onClick={() => closeRef.current()}
        />
      )}
      {/* decorative on desktop (follows the cursor); a real, perceivable layer
          while the mobile peek is open - hiding it then would leave AT users
          behind an overlay they cannot see or dismiss */}
      <div
        ref={cardRef}
        className={`workHoverCard${shown ? " on" : ""}${touch ? " centered" : ""}`}
        aria-hidden={touch && shown ? undefined : true}
        onClick={onCardTap}
      >
        <div className="workHoverInner">
          <div className="workHoverMedia">
            {preview?.type === "video" ? (
              <video
                key={active?.slug}
                src={preview.src}
                poster={preview.poster}
                muted
                loop
                autoPlay={!reduce}
                playsInline
                preload="none"
              />
            ) : preview?.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={active?.slug} src={preview.src} alt="" />
            ) : (
              <span className="workHoverPh">&#9654; preview</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const CSS = `
  .workHoverCard {
    position: fixed; top: 0; left: 0; z-index: 210;
    /* 480 is the target, but it must always leave room for the PAD=16 clamp in
       apply() - that clamp moves the card, it never shrinks it, so a fixed width
       wider than the window pins the card left and spills off the right edge.
       48px of slack covers both pads plus a vertical scrollbar. */
    width: min(480px, calc(100vw - 48px)); pointer-events: none; will-change: transform;
  }
  .workHoverCard.centered {
    left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: min(86vw, 440px);
  }
  /* only capture taps while the peek is actually visible - otherwise the
     hidden fixed card silently blocks taps at screen centre (nav / TOC) */
  .workHoverCard.centered.on { pointer-events: auto; cursor: pointer; }
  .workHoverInner {
    border: 1px solid #7c828b; box-shadow: 0 16px 44px rgba(0,0,0,0.45);
    background: #232220; overflow: hidden;
    opacity: 0; transform: scale(0.82); transform-origin: center;
    transition: opacity 0.16s ease, transform 0.24s cubic-bezier(0.16,0.84,0.28,1);
    will-change: opacity, transform;
  }
  .workHoverCard.on .workHoverInner { opacity: 1; transform: scale(1); }
  .workHoverMedia {
    position: relative; aspect-ratio: 16 / 10; overflow: hidden;
    background: #232220; display: flex; align-items: center; justify-content: center;
  }
  .workHoverMedia video, .workHoverMedia img {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  .workHoverPh {
    color: #cfd2d6; font-family: "Times New Roman", Times, serif;
    font-variant: small-caps; letter-spacing: 0.18em; font-size: var(--t-small);
  }
  .workHoverBackdrop {
    position: fixed; inset: 0; z-index: 205;
    background: rgba(0,0,0,0.42); pointer-events: auto;
  }
  @media (prefers-reduced-motion: reduce) {
    .workHoverInner { transition: opacity 0.12s ease; transform: none; }
    .workHoverCard.on .workHoverInner { transform: none; }
  }
`;
