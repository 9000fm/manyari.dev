"use client";
import { useState, useEffect, useRef, type CSSProperties } from "react";
import { NAV_SECTIONS } from "./shared";
import { UI_ES } from "@/content.es";
import { useLang } from "./useLang";
import LangSwitch from "./LangSwitch";

// Mobile-only header, "article chrome" style (lab pick): a grey Monobook panel
// with the name in small caps and a wiki contents [show]/[hide] toggle. Hidden
// at the top of the page; slides in once you scroll past the identity block.
// The drop squishes open and releases the entries one by one.
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  // This menu's labels are re-rendered by React, so they cannot ride along in a
  // data-es attribute the way the static page does: the next render would put
  // English back. It follows <html lang> instead.
  const es = useLang() === "es";

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > 200;
      setShown(past);
      if (!past) setOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // an open menu closes on scroll-away, tap outside, or Escape - otherwise it
  // stays pinned over the article while the page moves under it
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
      if (e.key === "Escape") setOpen(false);
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
    <nav ref={rootRef} aria-label="Site" className={`mnav${shown || open ? " mnavShown" : ""}`}>
      <a href="#top" className="mnavBrand" onClick={() => setOpen(false)}>Flavio Manyari</a>
      <button
        className="mnavTog"
        aria-expanded={open}
        aria-controls="mnavMenu"
        onClick={() => setOpen((o) => !o)}
      >
        {es ? UI_ES.contentsLower : "contents"} {open ? (es ? UI_ES.hide : "[hide]") : es ? UI_ES.show : "[show]"}
      </button>
      <div className={`mnavDrop${open ? " on" : ""}`} id="mnavMenu">
        <div className="mnavDropIn">
          <ol className="mnavList">
            {NAV_SECTIONS.map((s, i) => (
              <li key={s.id} style={{ "--i": i } as CSSProperties}>
                <a href={`#${s.id}`} onClick={() => setOpen(false)}>{es ? s.labelEs : s.label}</a>
              </li>
            ))}
          </ol>
          {/* Once you are scrolled into the document the sidebar portlet is far
              above, so the language links repeat here. Both switches read the
              same <html lang>, so they never disagree. */}
          <div className="mnavLangs">
            <span className="mnavLangsLabel">{es ? UI_ES.otherLanguages : "Other languages"}</span>
            <LangSwitch variant="list" />
          </div>
        </div>
      </div>
    </nav>
  );
}
