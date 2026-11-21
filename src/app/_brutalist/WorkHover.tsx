"use client";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { useLang } from "./useLang";
import { PROJECTS, type Project } from "@/content";

// Desktop: cursor preview. Touch and compact layouts: tap to enlarge, then visit.
const DESKTOP_PREVIEW_WIDTH = 720;

type Preview = { type: "video" | "image"; src: string; poster?: string };

// Real assets, keyed by project slug. Missing slug => placeholder card.
// Stepped-slideshow MP4s of the live sites (re-encoded from the source GIFs:
// ~70% smaller, and the poster doubles as the reduced-motion static frame).
const PREVIEWS: Record<string, Preview> = {
  civiclick: { type: "video", src: "/previews/civiclick.mp4", poster: "/previews/civiclick.jpg" },
  brisol: { type: "video", src: "/previews/brisol.mp4", poster: "/previews/brisol.jpg" },
  ecolution: { type: "video", src: "/previews/ecolution.mp4", poster: "/previews/ecolution.jpg" },
  tonydecay:  { type: "video", src: "/previews/tonydecay.mp4",  poster: "/previews/tonydecay.jpg" },
  silverback: { type: "video", src: "/previews/silverback.mp4", poster: "/previews/silverback.jpg" },
  superself:  { type: "video", src: "/previews/superself.mp4",  poster: "/previews/superself.jpg" },
  micaela:    { type: "video", src: "/previews/micaela.mp4",    poster: "/previews/micaela.jpg" },
  digeart:    { type: "video", src: "/previews/digeart.mp4",    poster: "/previews/digeart.jpg" },
};

const PREVIEW_SIZES = {
  desktop: { width: 720, height: 450 },
  phone: { width: 390, height: 760 },
  tablet: { width: 768, height: 900 },
} as const;

const PHONE_WIDTH = "(max-width:599px)";
function subscribePhoneWidth(listener: () => void) {
  const query = window.matchMedia(PHONE_WIDTH);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

const DESKTOP_INPUT = "(min-width:900px) and (hover:hover) and (pointer:fine)";
function subscribeInput(listener: () => void) {
  const query = window.matchMedia(DESKTOP_INPUT);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

export default function WorkHover({ tapRequest }: { tapRequest: { slug: string; id: number } | null }) {
  const fine = useSyncExternalStore(subscribeInput, () => window.matchMedia(DESKTOP_INPUT).matches, () => true);
  const touch = !fine;
  const phone = useSyncExternalStore(subscribePhoneWidth, () => window.matchMedia(PHONE_WIDTH).matches, () => false);
  const format = fine ? "desktop" : phone ? "phone" : "tablet";
  const dimensions = PREVIEW_SIZES[format];
  const lang = useLang();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const handledTapRef = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);
  const closeRef = useRef<() => void>(() => {});
  const [active, setActive] = useState<Project | null>(null); // current row (content)
  const [shown, setShown] = useState(false); // visibility (drives grow/shrink)
  // reduced motion as state for render (autoPlay), the ref stays for the rAF paths
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(reduceRef.current);
    setShown(false);
    cardRef.current?.style.removeProperty("transform");

    const items = Array.from(
      document.querySelectorAll<HTMLLIElement>(".brutWork > li")
    );
    // map each work row to its project by matching the link href to PROJECTS.url
    const byLi = new Map<HTMLLIElement, Project>();
    for (const li of items) {
      const href = li.querySelector(".brutWorkHead a")?.getAttribute("href");
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

    // Touch requests are queued by WorkHoverLazy, including a cold first tap.
    if (!fine) {
      closeRef.current = () => setShown(false);
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
      const w = card.offsetWidth || DESKTOP_PREVIEW_WIDTH;
      const h = card.offsetHeight || DESKTOP_PREVIEW_WIDTH / 1.6;
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
        const w = cardRef.current?.offsetWidth || DESKTOP_PREVIEW_WIDTH;
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
    window.addEventListener("resize", apply);
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("resize", apply);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf);
    });

    return () => {
      window.clearTimeout(hideTimer);
      cancelAnimationFrame(raf);
      cleanups.forEach((c) => c());
    };
  }, [fine]);

  useEffect(() => {
    if (!touch || !tapRequest || handledTapRef.current === tapRequest.id) return;
    const project = PROJECTS.find(p => p.slug === tapRequest.slug);
    // Wait for the deferred component to finish installing its input handlers.
    const frame = requestAnimationFrame(() => {
      if (project) { handledTapRef.current = tapRequest.id; setActive(project); setShown(true); }
    });
    return () => cancelAnimationFrame(frame);
  }, [tapRequest, touch]);

  // while the mobile peek is up, the page must not scroll under the backdrop.
  // iOS Safari can rubber-band straight past body overflow:hidden, so the
  // touchmove gesture itself is blocked too (non-passive on purpose; nothing
  // inside the card scrolls, so swallowing the gesture costs nothing).
  useEffect(() => {
    if (!(touch && shown)) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus({ preventScroll: true });
    const onTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const controls = cardRef.current?.querySelectorAll<HTMLElement>("a[href], button");
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onTab);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const block = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", block, { passive: false });
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onTab);
      previousFocus?.focus({ preventScroll: true });
      document.removeEventListener("touchmove", block);
    };
  }, [touch, shown]);

  const desktopPreview = active ? PREVIEWS[active.slug] : undefined;
  const preview: Preview | undefined = active && desktopPreview && touch
    ? { type: "video", src: "/previews/" + format + "/" + active.slug + ".mp4", poster: "/previews/" + format + "/" + active.slug + ".jpg" }
    : desktopPreview;

  return (
    <>
      <style>{CSS}</style>
      {touch && shown && (
        <div
          className="workHoverBackdrop"
          role="button"
          aria-label={lang === "es" ? "Cerrar vista previa" : "Close preview"}
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
        role={touch && shown ? "dialog" : undefined}
        aria-modal={touch && shown ? true : undefined}
        aria-label={touch && shown ? active?.title : undefined}
        style={{
          "--preview-ratio": dimensions.width / dimensions.height,
          "--preview-max-width": Math.min(dimensions.width, DESKTOP_PREVIEW_WIDTH) + "px",
        } as CSSProperties}
        inert={!shown}
      >
        <div className="workHoverInner">
          {touch && <div className="workHoverHeading">{active?.title}</div>}
          <a className="workHoverMedia"
            href={touch && shown ? active?.url ?? undefined : undefined}
            target="_blank" rel="noopener noreferrer"
            tabIndex={touch && shown ? 0 : -1}
            aria-describedby={touch && shown ? "workHoverNotice" : undefined}
            aria-label={lang === "es" ? "Abrir sitio de " + active?.title : "Open " + active?.title + " website"}
          >
            {preview?.type === "video" ? (
              <video
                key={`${active?.slug}-${format}`}
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
          </a>
          {touch && (
            <p className="workHoverNotice" id="workHoverNotice">
              {lang === "es" ? "Toca para abrir en otra pestaña ↗" : "Tap to open in a new tab ↗"}
            </p>
          )}
          {touch && shown && (
            <button ref={closeButtonRef} type="button" className="workHoverClose"
              aria-label={lang === "es" ? "Cerrar vista previa" : "Close preview"}
              onClick={() => closeRef.current()}>
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

const CSS = `
  .workHoverCard {
    position: fixed; top: 0; left: 0; z-index: 210;
    /* Fit both viewport dimensions while keeping the preview larger than the plate.
       48px leaves room for the positioning clamp, border and scrollbar. */
    width: min(${DESKTOP_PREVIEW_WIDTH}px, calc(100vw - 48px), calc((100dvh - 48px) * 1.6));
    pointer-events: none; will-change: transform;
  }
  .workHoverCard.centered {
    left: 50%; top: 50%; transform: translate(-50%, -50%);
    /* Fit the real capture without cropping, including title and notice. */
    width: min(var(--preview-max-width), calc(100vw - 24px), calc((100dvh - 120px) * var(--preview-ratio)));
  }
  /* only capture taps while the peek is actually visible - otherwise the
     hidden fixed card silently blocks taps at screen centre (nav / TOC) */
  .workHoverCard.centered.on { pointer-events: auto; cursor: pointer; }
  .workHoverInner {
    position: relative;
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
  .workHoverCard.centered .workHoverInner {
    border-color: #a2a9b1; background: #f8f9fa; color: #202122;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  }
  .workHoverHeading {
    height: 44px; line-height: 43px; padding: 0 52px 0 12px;
    border-bottom: 1px solid #c8ccd1; font-size: var(--t-small);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .workHoverCard.centered .workHoverMedia { aspect-ratio: var(--preview-ratio); }
  .workHoverNotice {
    margin: 0; padding: 4px 8px; border-top: 1px solid #7c828b;
    background: #f6f7f9; color: #555; font-size: var(--t-micro);
    line-height: 1.45; text-align: center; cursor: auto;
  }
  .workHoverClose {
    position: absolute; top: 0; right: 0; z-index: 1;
    width: 44px; height: 44px; display: grid; place-items: center;
    border: 0; border-left: 1px solid #c8ccd1; background: #f8f9fa; color: #202122;
    font: inherit; font-size: var(--t-head); cursor: pointer;
  }
  .workHoverClose:focus-visible, .workHoverMedia:focus-visible { outline: 2px solid #0645ad; outline-offset: -3px; }
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
