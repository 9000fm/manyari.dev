"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang, applyLang, bootLang, type Lang } from "./useLang";

/**
 * The interlanguage control, in three shapes:
 *
 *   button  labeled current-language control with an attached menu.
 *   list    one language per row, for the mobile burger menu.
 *   inline  dot-separated, for a single line of running chrome.
 *
 * This component is only the control. Reading and writing the page language
 * lives in useLang.ts; see that file for how the translation actually works.
 * Two of these are mounted (the page button and the mobile menu) and both read
 * the same store, so they can never disagree.
 */


export default function LangSwitch({ variant = "inline" }: { variant?: "inline" | "list" | "button" }) {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    bootLang();
  }, []);


  // dismiss on outside press, Escape, or a viewport resize
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
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const openAt = useCallback(() => {
    setOpen((o) => !o);
  }, []);

  const choose = (code: Lang) => {
    setOpen(false);
    applyLang(code);
    btnRef.current?.focus({ preventScroll: true });
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
          aria-label={lang === "es" ? "Cambiar de idioma (Español)" : "Change language (English)"}
        >
          <span className="langBtnLabel" aria-hidden="true">{lang === "es" ? "Idioma" : "Language"}</span>
          <span className="langBtnIcon" aria-hidden="true">文A</span>
          <span className="langBtnCurrent" aria-hidden="true">{lang === "es" ? "Español" : "English"}</span>
        </button>
        {open ? (
          <div
            ref={popRef}
            className="langPop"
            role="menu"
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
