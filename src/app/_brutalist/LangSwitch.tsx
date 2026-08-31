"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLang, applyLang, bootLang, type Lang } from "./useLang";

/**
 * The interlanguage control, in three shapes:
 *
 *   button  the one on the page. Vector 2022 puts a bordered language control at
 *           the top right of the article; pressing it opens a panel of editions.
 *           Here the button is the language glyph alone and the panel opens AT
 *           THE POINTER, so on a phone the choices land under your thumb instead
 *           of at a fixed corner you then have to reach for.
 *   list    one language per row, for the mobile burger menu.
 *   inline  dot-separated, for a single line of running chrome.
 *
 * This component is only the control. Reading and writing the page language
 * lives in useLang.ts; see that file for how the translation actually works.
 * Two of these are mounted (the page button and the mobile menu) and both read
 * the same store, so they can never disagree.
 */

const PAD = 8; // keep the panel this far inside the viewport

export default function LangSwitch({ variant = "inline" }: { variant?: "inline" | "list" | "button" }) {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    bootLang();
  }, []);

  // Clamp after paint: the panel is placed at the pointer, which near an edge
  // would push it out. Measuring is the only way to know how far. The bound is
  // the page frame rather than the viewport, so the panel never floats out over
  // the grey desk and reads as having escaped the document.
  useLayoutEffect(() => {
    if (!open || !pos) return;
    const el = popRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const frame = document.querySelector(".wrap")?.getBoundingClientRect();
    const left = Math.max(PAD, frame ? frame.left + PAD : PAD);
    const right = Math.min(window.innerWidth - PAD, frame ? frame.right - PAD : window.innerWidth - PAD);
    const x = Math.max(left, Math.min(pos.x, right - r.width));
    const y = Math.max(PAD, Math.min(pos.y, window.innerHeight - r.height - PAD));
    if (Math.round(x) !== Math.round(pos.x) || Math.round(y) !== Math.round(pos.y)) setPos({ x, y });
  }, [open, pos]);

  // dismiss on outside press, Escape, or anything that moves the page under it
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const close = () => setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const openAt = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // a keyboard press reports 0,0, so fall back to the button's own corner
    const from =
      e.clientX || e.clientY
        ? { x: e.clientX, y: e.clientY }
        : (() => {
            const r = e.currentTarget.getBoundingClientRect();
            return { x: r.left, y: r.bottom + 4 };
          })();
    setPos(from);
    setOpen((o) => !o);
  }, []);

  const choose = (code: Lang) => {
    setOpen(false);
    applyLang(code);
  };

  const item = (code: Lang, label: string) => (
    <button
      type="button"
      className={lang === code ? "langOn" : "langOff"}
      aria-current={lang === code ? "true" : undefined}
      onClick={() => applyLang(code)}
      lang={code === "es" ? "es" : undefined}
    >
      {label}
    </button>
  );

  if (variant === "button") {
    return (
      <>
        <button
          ref={btnRef}
          type="button"
          className={open ? "langBtn langBtnOpen" : "langBtn"}
          onClick={openAt}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={lang === "es" ? "Cambiar de idioma" : "Change language"}
        >
          <span className="langBtnIcon" aria-hidden="true">文A</span>
        </button>
        {open && pos ? (
          <div
            ref={popRef}
            className="langPop"
            role="menu"
            style={{ left: pos.x, top: pos.y }}
          >
            <span className="langPopLabel" aria-hidden="true">
              {lang === "es" ? "Idioma" : "Language"}
            </span>
            <button
              type="button"
              role="menuitem"
              className={lang === "en" ? "langOn" : "langOff"}
              aria-current={lang === "en" ? "true" : undefined}
              onClick={() => choose("en")}
              autoFocus
            >
              English
            </button>
            <button
              type="button"
              role="menuitem"
              className={lang === "es" ? "langOn" : "langOff"}
              aria-current={lang === "es" ? "true" : undefined}
              onClick={() => choose("es")}
              lang="es"
            >
              Español
            </button>
          </div>
        ) : null}
      </>
    );
  }

  if (variant === "list") {
    return (
      <ul className="langList">
        <li>{item("en", "English")}</li>
        <li>{item("es", "Español")}</li>
      </ul>
    );
  }

  return (
    <span className="langSwitch">
      {item("en", "English")}
      <span className="langSep"> · </span>
      {item("es", "Español")}
    </span>
  );
}
