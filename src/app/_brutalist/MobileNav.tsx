"use client";
import { useState, useEffect } from "react";
import { NAV_SECTIONS } from "./shared";

// Mobile-only header. Hidden at the top of the page; slides in smoothly once
// you scroll past the identity block. The burger opens the same numbered
// Contents list used in the sidebar (one consistent nav).
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

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

  return (
    <div className={`mnav${shown || open ? " mnavShown" : ""}`}>
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
        <div className="mnavMenu">
          <span className="mnavMenuLabel">Contents</span>
          <ol>
            {NAV_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} onClick={() => setOpen(false)}>{s.label}</a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
