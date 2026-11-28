"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PROJECTS } from "@/content";
import { useLang } from "./useLang";
import "./work-preview.css";

const PHONE_VIEW = "(max-width: 700px), (pointer: coarse) and (max-height: 500px)";

const DEVICES = {
  imac: { file: "imac-2009", width: 1160, height: 935, name: "iMac (2009)" },
  thunderbolt: { file: "thunderbolt-2011", width: 446, height: 341, name: "Apple Thunderbolt Display (2011)" },
  iphone: { file: "iphone-5", width: 433, height: 920, name: "iPhone 5" },
} as const;

type Device = keyof typeof DEVICES;

function DevicePreview({ slug, device, reducedMotion }: { slug: string; device: Device; reducedMotion: boolean }) {
  const meta = DEVICES[device];
  const base = "/previews/" + (device === "iphone" ? "phone/" : "") + slug;
  const screenRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const screen = screenRef.current;
    const surface = surfaceRef.current;
    if (!screen || !surface) return;
    if (device !== "imac") {
      surface.style.transform = "";
      return;
    }
    // The iMac photo is a shallow trapezoid: top corners (72,40) and
    // (1088,40), bottom corners (49,620) and (1111,620).
    // Project the flat 16:9 surface onto that quad with one CSS homography.
    // This does not alter the source recording or its aspect-ratio fitting.
    const inset = 23 / 1062;
    const scale = 1 - 2 * inset;
    const align = () => {
      const { width: w, height: h } = screen.getBoundingClientRect();
      const source = getComputedStyle(surface);
      const sw = parseFloat(source.width);
      const sh = parseFloat(source.height);
      if (!(w && h && sw && sh)) return;
      surface.style.transform = `matrix3d(${scale * w / sw},0,0,0,${-inset * w / sh},${scale * h / sh},0,${(scale - 1) / sh},0,0,1,0,${inset * w},0,0,1)`;
    };
    align();
    const observer = new ResizeObserver(align);
    observer.observe(screen);
    return () => observer.disconnect();
  }, [device]);

  return (
    <div className={`previewDevice previewDevice--${device}`} data-device={meta.file}>
      {/* Device artwork stays separate from the project media (see CREDITS.txt). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/devices/${meta.file}.webp`} width={meta.width} height={meta.height} alt={meta.name} className="previewCase" />
      <div ref={screenRef} className="deviceScreen">
        <div ref={surfaceRef} className="deviceScreenSurface">
          {reducedMotion ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={base + ".jpg"} alt="" />
          ) : (
            <video key={base} src={base + ".mp4"} poster={base + ".jpg"} autoPlay loop muted playsInline preload="metadata" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function WorkHover() {
  const lang = useLang();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [phone, setPhone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const phoneQuery = matchMedia(PHONE_VIEW);
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setPhone(phoneQuery.matches);
      setReducedMotion(motionQuery.matches);
    };
    sync();
    phoneQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    const onClick = (e: MouseEvent) => {
      const button = e.target instanceof Element ? e.target.closest<HTMLButtonElement>(".plateZoom") : null;
      const slug = button?.dataset.preview;
      if (!button || !slug || !PROJECTS.some(p => p.slug === slug)) return;
      triggerRef.current = button;
      setPhone(phoneQuery.matches);
      setActiveSlug(slug);
    };
    document.addEventListener("click", onClick);
    // Warm only the three small device images. Project video is requested on click.
    for (const meta of Object.values(DEVICES)) {
      const image = new Image();
      image.src = `/devices/${meta.file}.webp`;
    }
    return () => {
      document.removeEventListener("click", onClick);
      phoneQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!activeSlug || !dialog) return;
    const root = document.documentElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    const scroll = window.scrollY;
    // The native dialog supplies the top layer, keyboard focus trap and inert
    // background. Preserve the scrollbar gutter so the page does not shift.
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    const preventBackgroundScroll = (e: Event) => e.preventDefault();
    dialog.addEventListener("wheel", preventBackgroundScroll, { passive: false });
    dialog.addEventListener("touchmove", preventBackgroundScroll, { passive: false });
    return () => {
      dialog.removeEventListener("wheel", preventBackgroundScroll);
      dialog.removeEventListener("touchmove", preventBackgroundScroll);
      dialog.close();
      document.body.style.overflow = previousBodyOverflow;
      root.style.overflow = previousRootOverflow;
      root.style.scrollbarGutter = previousGutter;
      window.scrollTo({ top: scroll, behavior: "instant" });
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [activeSlug]);

  const index = PROJECTS.findIndex(p => p.slug === activeSlug);
  const project = PROJECTS[index];
  const device: Device = phone ? "iphone" : index % 2 === 0 ? "imac" : "thunderbolt";
  const closeLabel = lang === "es" ? "Cerrar vista previa" : "Close preview";

  return (
    <dialog
      ref={dialogRef}
      className="projectPreview"
      aria-label={project ? `${lang === "es" ? "Vista previa de" : "Preview of"} ${project.title}` : undefined}
      onCancel={e => { e.preventDefault(); setActiveSlug(null); }}
      onClick={e => { if (e.target === e.currentTarget) setActiveSlug(null); }}
    >
      {activeSlug && project && <>
        <button ref={closeRef} type="button" className="projectPreviewClose" onClick={() => setActiveSlug(null)} aria-label={closeLabel}>×</button>
        <DevicePreview slug={activeSlug} device={device} reducedMotion={reducedMotion} />
        <a className="projectPreviewInfo" href="/devices/CREDITS.txt" target="_blank" rel="noopener noreferrer" aria-label={lang === "es" ? "Autoría y licencias de las imágenes" : "Device artwork authors and licenses"} title={lang === "es" ? "Autoría y licencias" : "Artwork authors and licenses"}>ⓘ</a>
      </>}
    </dialog>
  );
}
