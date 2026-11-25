// What scripts/assets.mjs captures, per project. This file IS the curation:
// the ordered frame list becomes the hover preview (first frame is always
// "home", it doubles as the poster), and the plate candidates are the 2-3
// crops the owner picks from on the contact sheet.
//
// Per project: slug, url, settle?, colorScheme?, reducedMotion?, animations?, dismiss?[], hide?[], afterOpen?[steps], frames[], plates[]
// Per frame:   name, url?, continue?, steps?[], settle?
// Per plate:   name, caption, url?, steps?[], hide?[], clip{x,y,width,height} | selector, gamma?, contrast?, autocontrast?
//              Every plate clip is the full 1440x900 viewport (16:10, the preview's box) so all projects share one ratio.
// Steps: {waitFor: selector, state?: attached|visible|hidden|detached} {goto} {click} {tapIf: selector} {press} {hover} {scroll: number|selector, offset?} {evaluate: "js"} {hide: [...]} {waitCanvas: true} {wait: ms}
// click fails if the element is missing; tapIf clicks only if it shows up within 3 s (entry gates).
// Selectors are Playwright selectors. clip is viewport-relative: scroll first, then clip.
// `dismiss` selectors are clicked once if visible (entry gates, consent), `hide` selectors
// are made invisible (sign-in bars, sticky promos). Scout a site with
// `npm run assets -- inspect <url> [--click <selector>]` before editing this file.

export const VIEWPORT = { width: 1440, height: 900 }; // 16:10 = .workHoverMedia; 2x the 720x450 preview
export const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36";

export const PROJECTS = [
  {
    slug: "digeart",
    url: "https://digeart.online",
    // sign-in modal (fixed, z-10000) and the soft sign-in bar; the icon rail uses aria-labels
    hide: ['div.fixed.inset-0:has-text("Continue with Google")', 'div.fixed:has-text("Sign in for a better experience")'],
    frames: [
      {name: "home"},
      {name: "mixes",steps: [{click: "button[aria-label=\"Mixes\"]"},{wait: 1500}]},
      {name: "samples",steps: [{click: "button[aria-label=\"Samples\"]"},{wait: 1500}]},
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
      {name: "home"},
      {name: "shop",url: "https://tonydecay.com/shop"},
      {name: "gallery",url: "https://tonydecay.com/gallery"},
      {name: "home-specs",steps: [{scroll: "h2:has-text(\"PRINT SPECS\")",offset: 110}]},
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
      {name: "home"},
      {name: "home-featured",steps: [{scroll: "h2:has-text(\"FEATURED PRODUCTS\")",offset: 120}]},
      {name: "product",url: "https://www.silverbackstripes.com/products/silverback-v-3-black-grey-shorts"},
      {name: "story",url: "https://www.silverbackstripes.com/pages/our-story-1"},
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
    afterOpen: [
      { waitFor: '[aria-label="Enter site"]', state: "attached" },
      { click: '[aria-label="Enter site"]' },
      { waitFor: '[aria-label="Enter site"]', state: "detached" },
      { wait: 4000 }, // Let the title scramble settle before the poster frame.
      { waitCanvas: true },
    ],
    // Capture the interface and two fully loaded panels.
    frames: [
      {name: "home"},
      {name: "about",continue: true,steps: [{click: "button[aria-label=\"acerca\"]"},{waitFor: "[data-window=\"about\"]"}],settle: 1800},
      {name: "shop",continue: true,steps: [{click: "button[aria-label=\"acerca\"]"},{waitFor: "[data-window=\"about\"]",state: "hidden"},{click: "button[aria-label=\"tienda\"]"},{waitFor: "[data-window=\"shop\"]"}],settle: 2700},
    ],
    plates: [
      { name: "corridor", caption: "The label's main interface, drawn in one-point perspective.", gamma: 0.5, clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "corridor-later", caption: "The label's main interface, drawn in one-point perspective.", gamma: 0.5, steps: [{ wait: 3000 }], clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "corridor-lift", caption: "The label's main interface, drawn in one-point perspective.", gamma: 0.35, clip: { x: 0, y: 0, width: 1440, height: 900 } },
    ],
  },
  {
    slug: "civiclick",
    // Set CIVICLICK_CAPTURE_URL to the delivered local prototype URL.
    // The current production site may differ from the authored prototype.
    url: process.env.CIVICLICK_CAPTURE_URL,
    frames: [
      {name: "home"},
      {name: "tools",continue: true,steps: [{scroll: "h2:has-text(\"Advocacy Software Tools Built For Winning Campaigns\")",offset: 100}]},
      {name: "personalized",continue: true,steps: [{scroll: "section.sec--notch",offset: 80}]},
    ],
    plates: [
      { name: "home", caption: "Homepage prototype prepared for WordPress implementation.", clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "sections", caption: "Homepage sections.", steps: [{ scroll: 1400 }], clip: { x: 0, y: 0, width: 1440, height: 900 } },
    ],
  },
  {
    slug: "brisol",
    url: "https://brisol.pe",
    frames: [
      {name: "home"},
      {name: "benefits",continue: true,steps: [{scroll: "h2:has-text(\"¿Por qué elegir Brisol Energías Renovables?\")",offset: 100}]},
      {name: "case-study",continue: true,steps: [{scroll: "h2:has-text(\"Clinica Cerro Colorado\")",offset: 200}]},
    ],
    plates: [
      { name: "home", caption: "The WordPress site maintained for Brisol.", clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "sections", caption: "Homepage sections.", steps: [{ scroll: 1400 }], clip: { x: 0, y: 0, width: 1440, height: 900 } },
    ],
  },
  {
    slug: "ecolution",
    url: "https://ecolutionsolar.com.au",
    frames: [
      {name: "home"},
      {name: "services",steps: [{scroll: "h3:has-text(\"Residential Solar\")",offset: 315}],continue: true},
      {name: "why",steps: [{scroll: "h2:has-text(\"Why Choose Us?\")",offset: 150}],continue: true},
    ],
    plates: [
      { name: "home", caption: "Ecolution Industries, Australia. Website redesign, 2025.", clip: { x: 0, y: 0, width: 1440, height: 900 } },
      { name: "sections", caption: "Homepage sections.", steps: [{ scroll: 1400 }], clip: { x: 0, y: 0, width: 1440, height: 900 } },
    ],
  },
];
