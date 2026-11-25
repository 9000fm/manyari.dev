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
  const videoRef = useRef<HTMLVideoElement>(null);
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
    let lastPoint: { x: number; y: number } | null = null;
    let currentRow: HTMLLIElement | null = null;
    let dismissedRow: HTMLLIElement | null = null;
    const hide = () => {
      if (!visible) return;
      visible = false;
      cancelAnimationFrame(raf);
      raf = 0;
      setShown(false);
    };
    closeRef.current = () => {
      dismissedRow = currentRow; // Escape stays dismissed until the pointer leaves the image band.
      hide();
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

    // Only a real mouse position change can activate the preview. Scrolling a
    // project beneath a stationary pointer must never open a video.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (lastPoint?.x === e.clientX && lastPoint.y === e.clientY) return;
      lastPoint = { x: e.clientX, y: e.clientY };
      const target = e.target instanceof Element ? e.target : null;
      const row = target?.closest<HTMLLIElement>(".brutWork > li") ?? null;
      const project = row ? byLi.get(row) : undefined;
      const image = row?.querySelector<HTMLImageElement>(".brutPlate img");
      const bounds = image?.getBoundingClientRect();
      const rowBounds = row?.getBoundingClientRect();
      // Allow the full horizontal strip beside the image, but never the
      // caption, project heading, description, technologies or row spacing.
      const inImageBand = !!(row && project && bounds && rowBounds &&
        e.clientY >= bounds.top && e.clientY < bounds.bottom &&
        e.clientX >= rowBounds.left && e.clientX < rowBounds.right);
      if (!inImageBand || !row || !project) {
        currentRow = null;
        dismissedRow = null;
        hide();
        return;
      }
      if (dismissedRow === row) return;
      dismissedRow = null;
      tx = e.clientX;
      ty = e.clientY;
      if (!visible || currentRow !== row) {
        cx = tx;
        cy = ty;
        const w = cardRef.current?.offsetWidth || DESKTOP_PREVIEW_WIDTH;
        sideRight = tx + GAP + w + PAD <= window.innerWidth;
        currentRow = row;
        visible = true;
        setActive(project);
        setShown(true);
        apply();
      }
      if (reduceRef.current) {
        cx = tx;
        cy = ty;
        apply();
      } else {
        kick();
      }
    };

    // Scroll only dismisses. It never hit-tests or activates a new row.
    const onScroll = () => hide();
    const onPointerOut = (e: PointerEvent) => {
      if (e.relatedTarget === null) {
        currentRow = null;
        dismissedRow = null;
        lastPoint = null;
        hide();
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("wheel", onScroll, { passive: true });
    window.addEventListener("resize", hide);
    window.addEventListener("blur", hide);
    cleanups.push(() => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("resize", hide);
      window.removeEventListener("blur", hide);
    });

    return () => {
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
  const previewHref = touch && shown ? active?.url ?? undefined : undefined;

  // Hidden videos must not continue decoding/playing in the background.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shown && !reduce) void video.play().catch(() => {});
    else video.pause();
  }, [shown, reduce, preview?.src]);

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
            href={previewHref}
            target="_blank" rel="noopener noreferrer"
            tabIndex={touch && shown ? 0 : -1}
            aria-describedby={touch && shown ? "workHoverNotice" : undefined}
            aria-label={lang === "es" ? "Abrir sitio de " + active?.title : "Open " + active?.title + " website"}
          >
            {preview?.type === "video" ? (
              <video
                ref={videoRef}
                key={`${active?.slug}-${format}`}
                src={preview.src}
                poster={preview.poster}
                muted
                loop
                autoPlay={shown && !reduce}
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
          {touch && (phone ? (
            <a className="workHoverNotice" id="workHoverNotice"
              href={previewHref} target="_blank" rel="noopener noreferrer">
              {lang === "es" ? "Abrir en otra pestaña ↗" : "Open in new tab ↗"}
            </a>
          ) : (
            <p className="workHoverNotice" id="workHoverNotice">
              {lang === "es" ? "Toca para abrir en otra pestaña ↗" : "Tap to open in a new tab ↗"}
            </p>
          ))}
          {touch && shown && (
            <button ref={closeButtonRef} type="button" className="workHoverClose"
              aria-label={lang === "es" ? "Cerrar vista previa" : "Close preview"}
              onClick={() => closeRef.current()}>
              <span aria-hidden="true">×</span>
            </button>
          )}
          {touch && phone && shown && (
            <button type="button" className="workHoverHome"
              aria-label={lang === "es" ? "Cerrar con el botón de inicio" : "Close with the home button"}
              onClick={() => closeRef.current()} />
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
  @media (max-width: 599px) {
    .workHoverBackdrop { background: #1e1d1ca0; }
    .workHoverCard.centered {
      --rim: clamp(9px, 3.5dvh, 19px);
      --cap: clamp(16px, 5.9dvh, 39px);
      --chin: clamp(44px, 8.8dvh, 51px);
      --space: 104px;
      --case-radius: clamp(10px, 4dvh, 26px);
      --video-width: max(16px, min(390px, calc(100vw - 39px - 2 * var(--rim)),
        calc((100dvh - var(--space) - var(--cap) - var(--chin)) * 0.513157895)));
      width: calc(var(--video-width) + 2 * var(--rim));
      top: calc(50% + 3px);
    }
    .workHoverCard.centered .workHoverInner {
      isolation: isolate;
      display: flow-root;
      overflow: visible;
      padding: 0 var(--rim) var(--chin);
      border: 0;
      border-radius: var(--case-radius);
      background: linear-gradient(128deg, #373739, #e0e0df 13%, #707171 27%, #aaa 54%,
        #575758 79%, #dadada 93%, #4a4a4b);
      box-shadow: inset 0 0 0 1px #bdbdbe, inset 0 0 0 3px #a9a9a9,
        0 2px 0 #515152, 0 4px 0 -1px #101011, 0 11px 14px -6px #000c, 0 24px 38px -11px #000b;
      cursor: auto;
    }
    .workHoverCard.centered .workHoverInner::before,
    .workHoverCard.centered .workHoverInner::after {
      content: "";
      position: absolute;
      pointer-events: none;
    }
    .workHoverCard.centered .workHoverInner::before {
      z-index: -1;
      inset: 4px;
      border-radius: calc(var(--case-radius) - 3px);
      border: 1px solid #0a0a0b;
      background: linear-gradient(152deg, #444446 0%, #161617 11%, #161617 21%,
        #101011 21.5%, #050506 78%, #151516);
      box-shadow: inset 0 1px 3px #ffffff62, inset 0 -2px 2px #000;
    }
    .workHoverCard.centered .workHoverInner::after {
      z-index: -2;
      inset: -2px -2px 0;
      background:
        linear-gradient(0deg, #343436, #a9a9a9 70%, #666) 80% top / 17% 3px no-repeat,
        linear-gradient(90deg, #383839, #b1b1b2 60%, #171718) left 16% / 3px 4% no-repeat,
        radial-gradient(ellipse at right, #868687, #323233 62%, transparent 71%) left 26% / 5px 8px no-repeat,
        radial-gradient(ellipse at right, #868687, #323233 62%, transparent 71%) left 32% / 5px 8px no-repeat;
    }
    .workHoverCard.centered .workHoverHeading {
      position: relative;
      height: var(--cap);
      padding: 0;
      border: 0;
      overflow: visible;
      font-size: 0;
      line-height: 0;
      color: transparent;
    }
    .workHoverCard.centered .workHoverHeading::before,
    .workHoverCard.centered .workHoverHeading::after {
      content: "";
      position: absolute;
      top: calc(50% + 1px);
      translate: -50% -50%;
    }
    .workHoverCard.centered .workHoverHeading::before {
      left: 50%;
      width: clamp(12px, 21%, 44px);
      height: clamp(3px, 16%, 6px);
      border-radius: 10px;
      background: repeating-linear-gradient(90deg, #070708 0 1px, #3a3a3a 1px 2px);
      box-shadow: 0 0 0 1px #050505, 0 1px 0 1px #ffffff33;
    }
    .workHoverCard.centered .workHoverHeading::after {
      left: 33%;
      width: clamp(2px, 2.2%, 6px);
      aspect-ratio: 1;
      border-radius: 50%;
      background: radial-gradient(circle at 36% 39%, #697282 0%, #252d3b 28%, #09090a 70%);
      box-shadow: 0 0 0 1px #28282b;
    }
    .workHoverCard.centered .workHoverMedia {
      background: #0a0a0b;
      overflow: hidden;
      outline: 1px solid #373737;
      outline-offset: 1px;
      box-shadow: 0 0 0 1px #000, 0 0 2px 2px #ffffff11;
    }
    .workHoverCard.centered .workHoverMedia video { object-fit: contain; }
    .workHoverCard.centered .workHoverMedia:focus-visible {
      outline: 2px solid #96c3ff;
      outline-offset: -3px;
    }
    .workHoverCard.centered .workHoverNotice {
      position: absolute;
      width: max-content;
      max-width: calc(100vw - 20px);
      left: 50%;
      top: calc(100% + 11px);
      translate: -50% 0;
      padding: 3px 8px;
      background: #f8f9fa;
      color: #202122;
      border: 1px solid #a2a9b1;
      white-space: normal;
      text-wrap: balance;
      line-height: 1.25;
      font-family: "Times New Roman", Times, serif;
    }
    .workHoverCard.centered a.workHoverNotice { cursor: pointer; text-decoration: none; }
    .workHoverCard.centered a.workHoverNotice:focus-visible { outline: 2px solid #0645ad; outline-offset: -3px; }
    .workHoverCard.centered .workHoverClose {
      inset: auto 0 calc(100% + 6px) auto;
      border: 1px solid #a2a9b1;
      box-shadow: 0 2px 4px #0003;
    }
    .workHoverCard.centered .workHoverClose span { line-height: 1; }
    .workHoverHome {
      position: absolute;
      left: 50%;
      bottom: calc(var(--chin) / 2);
      translate: -50% 50%;
      width: 44px;
      height: 44px;
      border: 0;
      background: transparent;
      cursor: pointer;
    }
    .workHoverHome::before, .workHoverHome::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      translate: -50% -50%;
      aspect-ratio: 1;
      pointer-events: none;
    }
    .workHoverHome::before {
      width: calc(var(--chin) * .7);
      border-radius: 50%;
      background: radial-gradient(circle at 48% 95%, #343435, #181819 40%, #070708 82%);
      box-shadow: inset 0 2px 3px #000, inset 0 -1px 1px #ffffff3b,
        0 0 0 1px #000, 0 1px 0 1px #ffffff27;
    }
    .workHoverHome::after {
      width: calc(var(--chin) * .24);
      border-radius: 3px;
      border: 1px solid #a0a0a1;
    }
    .workHoverHome:focus-visible {
      outline: 2px solid #96c3ff;
      outline-offset: -3px;
      border-radius: 50%;
    }
    @media (max-height: 240px) {
      .workHoverCard.centered { --space: 72px; top: calc(50% - 5px); }
      .workHoverCard.centered .workHoverClose { inset: 0 auto auto calc(100% + 7px); }
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .workHoverInner { transition: opacity 0.12s ease; transform: none; }
    .workHoverCard.on .workHoverInner { transform: none; }
  }
`;
