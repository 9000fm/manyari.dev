"use client";
import { useState } from "react";
import { NAV_SECTIONS } from "./shared";

// Sticky mobile-only top bar: FM mark + burger that toggles the section nav.
// Hidden on desktop (the sidebar Contents box handles nav there).
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mnav">
      <a href="#top" className="mnavFM" onClick={() => setOpen(false)}>FM</a>
      <button
        className="mnavBurger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>
      {open && (
        <nav className="mnavMenu">
          {NAV_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={() => setOpen(false)}>
              {s.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
