"use client";
import { useState, useEffect, useRef } from "react";
import { NAV_SECTIONS } from "./shared";
import { UI_ES } from "@/content.es";
import { useLang } from "./useLang";
import LangSwitch from "./LangSwitch";

// G–07: fine parallel meridians.
function WorldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10.5" />
      <ellipse cx="12" cy="12" rx="3.2" ry="10.5" />
      <ellipse cx="12" cy="12" rx="7.5" ry="10.5" />
      <path d="M1.5 12h21M3 7h18M3 17h18" />
    </svg>
  );
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState<string>("about");
  const rootRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const es = useLang() === "es";

  useEffect(() => {
    // Native details keep manual toggles; only reset when their responsive mode changes.
    const desktopMedia = window.matchMedia("(min-width:900px)");
    const shortMedia = window.matchMedia("(min-width:900px) and (max-height:654px)");
    const toc = document.querySelector<HTMLDetailsElement>("#wikiToc");
    const note = document.querySelector<HTMLDetailsElement>("#wikiNote");
    const syncToc = () => { if (toc) toc.open = desktopMedia.matches; };
    const syncNote = () => { if (note) note.open = !shortMedia.matches; };
    syncToc();
    syncNote();
    desktopMedia.addEventListener("change", syncToc);
    shortMedia.addEventListener("change", syncNote);

    let raf = 0;
    let lastActive = "";
    const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("#wikiToc a[href^='#']"));
    const update = () => {
      raf = 0;
      const past = window.scrollY > 200;
      setShown(past);
      if (!past) setOpen(false);
      const desktop = desktopMedia.matches;
      const toplineHeight = document.querySelector(".topline")?.getBoundingClientRect().height ?? 0;
      const cutoff = desktop ? Math.max(105, toplineHeight + 48) : 105;
      let current: string = "about";
      for (const section of NAV_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= cutoff) current = section.id;
      }
      // Contact can be shorter than the viewport, so it may never reach the threshold.
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = "contact";
      setActive(current);
      if (current !== lastActive) {
        for (const link of tocLinks) {
          if (link.hash === `#${current}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }
        lastActive = current;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("langchange", onScroll);
    return () => {
      desktopMedia.removeEventListener("change", syncToc);
      shortMedia.removeEventListener("change", syncNote);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("langchange", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 24) setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav ref={rootRef} aria-label={es ? "Navegación" : "Site navigation"} className={`mnav${shown || open ? " mnavShown" : ""}`}>
      <a href="#top" className="mnavBrand" onClick={() => setOpen(false)}>
        <WorldIcon /><span>Flavio Manyari</span>
      </a>
      <button
        ref={toggleRef}
        type="button"
        className="mnavTog"
        aria-label={es ? (open ? "Cerrar menú" : "Abrir menú") : (open ? "Close menu" : "Open menu")}
        aria-expanded={open}
        aria-controls="mnavMenu"
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <circle cx="4" cy="6" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="4" cy="18" r="1.5"/>
          <path d="M8 5h14v2H8zM8 11h14v2H8zM8 17h14v2H8z"/>
        </svg>
      </button>
      <div className={`mnavDrop${open ? " on" : ""}`} id="mnavMenu" inert={!open} aria-hidden={!open}>
        <div className="mnavDropIn">
          <ul className="mnavList">
            {NAV_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? "location" : undefined} onClick={() => setOpen(false)}>
                  {es ? s.labelEs : s.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mnavFoot">
            <LangSwitch />
            <a href="#top" onClick={() => setOpen(false)}>{es ? UI_ES.backToTop : "Back to top"} ↑</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
