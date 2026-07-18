"use client";
import { useEffect } from "react";

/**
 * Robust in-page anchor scrolling. Native `href="#id"` hash-nav is flaky in
 * in-app webviews (Instagram, etc.) and gets disrupted by the Chrome translate
 * bar, so we intercept every same-page hash link and scroll with JS instead.
 * Respects the CSS scroll-margin-top (which offsets targets below the fixed
 * mobile navbar) and prefers-reduced-motion. Delegated listener => it covers
 * the sidebar Contents, the burger menu, the footer index, and back-to-top,
 * including links added/removed as menus open and close.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.(
        'a[href*="#"]'
      ) as HTMLAnchorElement | null;
      if (!a) return;

      const raw = a.getAttribute("href") || "";
      const hashIndex = raw.indexOf("#");
      if (hashIndex < 0) return;

      // only same-document links (ignore links to other pages)
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || url.host !== window.location.host)
        return;

      const id = decodeURIComponent(url.hash.slice(1));
      const el = id ? document.getElementById(id) : document.getElementById("top");
      if (!el) return;

      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", id ? `#${id}` : window.location.pathname);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
