"use client";
import { useSyncExternalStore } from "react";

/**
 * The language store.
 *
 * `<html lang>` is the single source of truth. This module owns both halves of
 * it: components read through `useLang()` and write through `applyLang()`, and
 * nothing else touches the attribute. Keeping the mutation here rather than
 * inside a component is also what the React compiler wants, since a component
 * body is not allowed to modify values from an outer scope.
 *
 * HOW THE PAGE IS TRANSLATED
 * The page stays a server component. Every translatable element is rendered in
 * English and carries its Spanish in a `data-es` attribute, so switching never
 * re-renders React, never ships a second copy of the markup, and costs nothing
 * on first load. `bootLang()` stamps each of those elements with `data-en` taken
 * from what the server already wrote, which is what lets us go back.
 *
 * THE SWAP
 * Deliberately instant. An animated transition was built and cut: a page of
 * Times set solid is the wrong surface for letters in motion, and 88 elements
 * resolving at once read as noise rather than as a document changing language.
 * A printed page does not animate when you pick up its other edition.
 *
 * The one thing worth spending code on is that nothing MOVES. Spanish runs
 * longer than English, so a plain swap re-wraps every paragraph and the page
 * slides under the reader. We anchor the scroll instead: note where the topmost
 * visible section sits, swap, then correct the scroll by however much it moved.
 * The line breaks change, the reading position does not.
 */

export type Lang = "en" | "es";

const EVENT = "langchange";
const KEY = "lang";

function subscribe(onChange: () => void): () => void {
  document.addEventListener(EVENT, onChange);
  return () => document.removeEventListener(EVENT, onChange);
}

function getSnapshot(): Lang {
  return document.documentElement.lang === "es" ? "es" : "en";
}

function getServerSnapshot(): Lang {
  return "en";
}

/** Current page language, kept in step across every switch on the page. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function announce(next: Lang) {
  document.documentElement.lang = next;
  // Text that React re-renders (the mobile menu) cannot be driven by data-es,
  // since the next render would put English back. It listens for this instead.
  document.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
}

function swapText(next: Lang) {
  // The tab title is not a data-es element: layout.tsx hangs both editions on <html>.
  const title = document.documentElement.dataset[next === "es" ? "titleEs" : "titleEn"];
  if (title) document.title = title;
  document.querySelectorAll<HTMLElement>("[data-es]").forEach((el) => {
    const to = next === "es" ? el.dataset.es : el.dataset.en;
    if (to !== undefined) el.textContent = to;
  });
  // Links with a Spanish edition (the CV PDF) carry it in data-es-href.
  document.querySelectorAll<HTMLElement>("[data-es-href]").forEach((el) => {
    const to = next === "es" ? el.dataset.esHref : el.dataset.enHref;
    if (to !== undefined) el.setAttribute("href", to);
  });
}

/**
 * One-time setup: remember the English the server rendered, then restore a
 * choice from a previous visit. Safe to call from every mounted switch; the
 * latch lives on the document because what it guards is a mutation of that same
 * document.
 */
export function bootLang(): void {
  const root = document.documentElement;
  if (root.dataset.i18n === "on") return;
  root.dataset.i18n = "on";

  document.querySelectorAll<HTMLElement>("[data-es]").forEach((el) => {
    if (el.dataset.en === undefined) el.dataset.en = el.textContent ?? "";
  });
  document.querySelectorAll<HTMLElement>("[data-es-href]").forEach((el) => {
    if (el.dataset.enHref === undefined) el.dataset.enHref = el.getAttribute("href") ?? "";
  });

  let saved: string | null = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    saved = null;
  }
  if (saved === "es") {
    swapText("es");
    announce("es");
  }
}

/** Switch the page, holding the reader's position steady. */
export function applyLang(next: Lang): void {
  if (next === getSnapshot()) return;

  // the topmost section still on screen is what the reader is looking at
  const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
  const anchor = sections.find((s) => s.getBoundingClientRect().bottom > 0) ?? null;
  const before = anchor ? anchor.getBoundingClientRect().top : 0;

  swapText(next);
  announce(next);

  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* private mode: the choice just does not persist */
  }

  if (anchor) {
    const shift = anchor.getBoundingClientRect().top - before;
    if (shift) window.scrollBy(0, shift);
  }
}
