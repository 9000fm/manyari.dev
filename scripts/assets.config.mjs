// What scripts/assets.mjs captures, per project. This file IS the curation:
// the ordered frame list becomes the hover preview (first frame is always
// "home", it doubles as the poster), and the plate candidates are the 2-3
// crops the owner picks from on the contact sheet.
//
// Per project: slug, url, settle?, colorScheme?, dismiss?[], hide?[], afterOpen?[steps], frames[], plates[]
// Per frame:   name, url?, continue?, steps?[], settle?
// Per plate:   name, caption, url?, steps?[], hide?[], clip{x,y,width,height} | selector, gamma?, contrast?, autocontrast?
//              Every plate clip is the full 1440x900 viewport (16:10, the preview's box) so all five share one ratio.
// Steps: {goto} {click} {tapIf: selector} {press} {hover} {scroll: number|selector, offset?} {evaluate: "js"} {hide: [...]} {waitCanvas: true} {wait: ms}
// click fails if the element is missing; tapIf clicks only if it shows up within 3 s (entry gates).
// Selectors are Playwright selectors. clip is viewport-relative: scroll first, then clip.
// `dismiss` selectors are clicked once if visible (entry gates, consent), `hide` selectors
// are made invisible (sign-in bars, sticky promos). Scout a site with
// `npm run assets -- inspect <url> [--click <selector>]` before editing this file.

export const VIEWPORT = { width: 1440, height: 900 }; // 16:10 = .workHoverMedia; 3x the 480x300 preview
export const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36";

export const PROJECTS = [
  {
    slug: "digeart",
    url: "https://digeart.online",
    // sign-in modal (fixed, z-10000) and the soft sign-in bar; the icon rail uses aria-labels
    hide: ['div.fixed.inset-0:has-text("Continue with Google")', 'div.fixed:has-text("Sign in for a better experience")'],
    frames: [
      { name: "home" }, // For You grid under the search field
      { name: "home-scrolled", steps: [{ scroll: 900 }] },
      { name: "mixes", steps: [{ click: 'button[aria-label="Mixes"]' }, { wait: 1500 }] },
      { name: "samples", steps: [{ click: 'button[aria-label="Samples"]' }, { wait: 1500 }] },
      { name: "about", steps: [{ click: 'button[aria-label="About"]' }, { wait: 800 }] },
    ],
    plates: [
      { name: "grid", caption: "Hand-curated discovery grid.", clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "grid-scrolled", caption: "Hand-curated discovery grid.", steps: [{ scroll: 300 }], clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "mixes", caption: "The Mixes view.", steps: [{ click: 'button[aria-label="Mixes"]' }, { wait: 1500 }], clip: { x: 0, y: 0, width: 1440, height: 900 } },
    ],
  },
  {
    slug: "tonydecay",
    url: "https://tonydecay.com",
    dismiss: ['div.fixed.inset-0:has-text("TAP TO ENTER")'], // entry gate over the whole page
    frames: [
      { name: "home" }, // #magazine hero
      { name: "home-foundation", steps: [{ scroll: 'h2:has-text("FOUNDATION SERIES")', offset: 110 }] },
      { name: "shop", url: "https://tonydecay.com/shop" },
      { name: "gallery", url: "https://tonydecay.com/gallery" },
      { name: "home-specs", steps: [{ scroll: 'h2:has-text("PRINT SPECS")', offset: 110 }] },
      { name: "about", url: "https://tonydecay.com/about" },
      { name: "faq", url: "https://tonydecay.com/faq" },
    ],
    plates: [
      { name: "foundation", caption: "Foundation Series, the fifteen-print collection page.", steps: [{ scroll: 'h2:has-text("FOUNDATION SERIES")', offset: 110 }], clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "home", caption: "The homepage hero.", clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "shop", caption: "The Foundation Series shop page.", url: "https://tonydecay.com/shop", clip: { x: 0, y: 0, width: 1440, height: 900 } },
    ],
  },
  {
    slug: "silverback",
    url: "https://www.silverbackstripes.com",
    afterOpen: [{ evaluate: "document.querySelectorAll('slideshow-component').forEach(s => s.pause && s.pause())" }], // Dawn announcement rotator
    frames: [
      { name: "home" }, // header + EARN YOUR STRIPES hero
      { name: "home-featured", steps: [{ scroll: 'h2:has-text("FEATURED PRODUCTS")', offset: 120 }] },
      { name: "collection", url: "https://www.silverbackstripes.com/collections/all" },
      { name: "product", url: "https://www.silverbackstripes.com/products/silverback-v-3-black-grey-shorts" },
      { name: "home-throwback", steps: [{ scroll: 'h2:has-text("THROWBACK SERIES")', offset: 160 }] },
      { name: "story", url: "https://www.silverbackstripes.com/pages/our-story-1" },
      { name: "troop", url: "https://www.silverbackstripes.com/pages/join-the-troop" },
    ],
    plates: [
      { name: "hero", caption: "Homepage hero after the redesign.", clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "hero-clean", caption: "Homepage hero after the redesign.", hide: ['[id$="__announcement-bar"]'], clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "featured", caption: "The featured products row.", steps: [{ scroll: 'h2:has-text("FEATURED PRODUCTS")', offset: 40 }], clip: { x: 0, y: 0, width: 1440, height: 900 } },
    ],
  },
  {
    slug: "superself",
    url: "https://superself.online",
    settle: 1500,
    // "Enter site" gate first (only on the first visit of a context: the site
    // remembers it), then wait for the 2D canvas to draw the corridor
    afterOpen: [{ tapIf: '[aria-label="Enter site"]' }, { wait: 1500 }, { waitCanvas: true }],
    // Everything behind the gate is drawn on canvas (no DOM controls to click),
    // so the preview is the corridor over time: one frame every ~2.5 s.
    frames: [
      { name: "home" },
      { name: "home-t2", continue: true, steps: [{ wait: 2500 }] },
      { name: "home-t3", continue: true, steps: [{ wait: 2500 }] },
      { name: "home-t4", continue: true, steps: [{ wait: 2500 }] },
      { name: "home-t5", continue: true, steps: [{ wait: 2500 }] },
      { name: "home-t6", continue: true, steps: [{ wait: 2500 }] },
    ],
    plates: [
      { name: "corridor", caption: "The label's main interface, drawn in one-point perspective.", gamma: 0.5, clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "corridor-later", caption: "The label's main interface, drawn in one-point perspective.", gamma: 0.5, steps: [{ wait: 3000 }], clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "corridor-lift", caption: "The label's main interface, drawn in one-point perspective.", gamma: 0.35, clip: { x: 0, y: 0, width: 1440, height: 900 } },
    ],
  },
  {
    slug: "micaela",
    url: "https://micaelalucia.com",
    settle: 800,
    frames: [
      { name: "home" }, // 100svh hero under the fixed header
      { name: "home-grid", steps: [{ scroll: 900 }] }, // hero is one viewport tall at 1440x900
      { name: "home-grid-2", steps: [{ scroll: 1800 }] },
      { name: "memoria-latente", url: "https://micaelalucia.com/proyectos/memoria-latente" },
      { name: "antes-del-2005", url: "https://micaelalucia.com/proyectos/antes-del-2005" },
      { name: "conciertos", url: "https://micaelalucia.com/proyectos/conciertos" },
      { name: "contacto", url: "https://micaelalucia.com/contacto" },
    ],
    plates: [
      { name: "grid", caption: "The photo grid, edge to edge.", clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "grid-scrolled", caption: "The photo grid, edge to edge.", steps: [{ scroll: 900 }], clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "grid-noheader", caption: "The photo grid, edge to edge.", hide: ["header"], clip: { x: 0, y: 0, width: 1440, height: 900 } },
    ],
  },
];
