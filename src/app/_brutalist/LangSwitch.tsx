"use client";
import { useEffect } from "react";
import { useLang, applyLang, bootLang } from "./useLang";

// The current edition is shown; one click switches to the other edition.
export default function LangSwitch() {
  const lang = useLang();
  useEffect(() => { bootLang(); }, []);
  return (
    <button type="button" className="langBtn" onClick={() => applyLang(lang === "en" ? "es" : "en")}
      aria-label={lang === "en" ? "Switch to Spanish" : "Cambiar a inglés"}>
      <span className="langBtnIcon" aria-hidden="true">文A</span>
      <span className="langBtnCurrent">{lang === "en" ? "English" : "Español"}</span>
    </button>
  );
}
