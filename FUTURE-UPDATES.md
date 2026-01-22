# Future Updates - superself.online

Last updated: January 2026 (v2.6)

---

## Recently Completed (v2.6)

### Shop Release
- [x] **Shop component** - Full product carousel with 4 SUPERSELF-T variants
- [x] **Polaroid-style photos** - Exaggerated bottom padding (60px desktop)
- [x] **Size selector** - S/M/L/XL buttons with Win95 styling
- [x] **WhatsApp ordering** - Pre-filled message with product + size
- [x] **Multi-language** - ES/EN/JP with scramble effects on change
- [x] **Touch swipe** - Carousel navigation on mobile
- [x] **Keyboard nav** - Arrow keys for carousel
- [x] **Code refactoring** - Extracted Shop, Toast, Win95Button components
- [x] **Constants file** - Centralized fonts, styles, contact info
- [x] **Products data** - Separate file for product catalog

### UI Polish (v2.5)
- [x] **Landscape warning** - Popup for mobile landscape mode
- [x] **Consistent Win95 bevels** - Unified button styling
- [x] **Improved spacing** - Better breathing room throughout

---

## Previously Completed (v2.4)

### Safari Mobile & UI Fixes
- [x] **Safari mobile viewport fix** - Changed `100vh` to `100dvh` with `-webkit-fill-available` fallback
- [x] **Title size increased 50%** - Now `clamp(2.25rem, 7.5vw, 3.75rem)`
- [x] **Shop window narrower** - Reduced to `280px`
- [x] **Burger button bigger on mobile** - Now `48px` minimum for better touch targets
- [x] **About panel positioned lower** - Doesn't overlap with dropdown menu

### Popup & Button Fixes
- [x] **OK button click reliability** - Added proper `onMouseDown`, `onTouchStart`, `onTouchEnd` handlers
- [x] **Popup drag jump fix** - Converts centered position to absolute on drag start
- [x] **Drag threshold increased** - From 5px to 10px for better mobile tap detection
- [x] **Shop panel click-through** - Clicking outside no longer closes it, only X button

### Scramble Effect Improvements
- [x] **Scramble on all text** - Now includes popup, about, and shop text
- [x] **Japanese katakana support** - Uses katakana characters when scrambling to JP
- [x] **Scramble overflow fix** - Added `word-break` and `overflow: hidden` to prevent text overflow
- [x] **Preserve spaces during scramble** - Maintains text width/layout

### UX Improvements
- [x] **Email error toast at mouse position** - Shows "ingresa un email valido" where user clicked
- [x] **Menu stays open on nav click** - Clicking acerca/tienda doesn't close burger menu
- [x] **Loading dots on YES click** - Animated `. → .. → ... → poof` before main screen
- [x] **Language switcher z-index** - Now `zIndex: 200` with `pointerEvents: auto` for Safari

### Performance
- [x] **Spinner component isolation** - Extracted to prevent re-renders every 150ms
- [x] **Smiley image priority loading** - Added `priority` prop and `imageRendering: pixelated`

---

## Priority: HIGH

### 1. Welcome Popup Drag on Mobile
**Status**: Improved but could be smoother
**Notes**:
- Drag threshold increased to 10px
- Jump on drag start fixed
- Could still benefit from momentum/physics

### 2. Mailing List Integration
**Status**: Not implemented
**Current**: Form submits but doesn't actually save emails
**Options**:
- Buttondown (simple, free tier)
- Mailchimp (popular, robust)
- ConvertKit (creator-focused)
- Supabase (if you want your own DB)

### 3. Code Refactoring
**Problem**: page.tsx is ~1900 lines - hard to maintain
**Solution**: Extract components to separate files

---

## Priority: MEDIUM

### 4. Sound Effects (Optional)
- Boot chime, click sounds, error beep
- Add sound toggle, default OFF

### 5. Keyboard Navigation Improvements
- Tab navigation, number keys for language
- `A` for About, `S` for Shop shortcuts

### 6. PWA Support
- manifest.json, service worker, splash screen

### 7. Dark Mode Toggle
- Invert colors (white bg, blue text)

---

## Priority: LOW

### 8. ~~Shop Page~~ DONE (v2.6)

### 9. Analytics
- Vercel Analytics or Plausible

### 10. SEO Improvements
- Open Graph images, JSON-LD, sitemap

### 11. Accessibility (a11y)
- aria-labels, focus states, reduced motion support

---

## Known Issues / Limitations

1. **Scramble effect doesn't work in Safari** - Likely a Safari rendering optimization. Core functionality (language changing) works, just no visual scramble animation. Acceptable limitation.

2. **Font loading**: VT323 from Google Fonts works but custom Fixedsys would be more authentic

3. **State management**: All in one component - consider extracting if it grows more complex

---

## Version History

| Version | Date | Key Features |
|---------|------|--------------|
| v1.0 | Dec 2025 | Initial website |
| v2.0 | Jan 2026 | Minimal rebuild |
| v2.1 | Jan 2026 | Burger menu, ASCII animation |
| v2.2 | Jan 2026 | Ripples, sparkles, UI polish |
| v2.3 | Jan 2026 | Skip button, mobile layout, scramble effect |
| v2.4 | Jan 2026 | Safari fixes, popup fixes, loading dots, scramble everywhere |
| v2.5 | Jan 2026 | Landscape warning, UI improvements |
| v2.6 | Jan 2026 | **Shop release** - SUPERSELF-T collection, WhatsApp ordering |

---

## Quick Start for Next Session

```bash
# Start dev server
cd E:\WEB+DESIGN\superself.online
npm run dev

# Main files to edit
src/app/page.tsx        # Main component
src/app/globals.css     # Animations, styles
src/app/AsciiArt.tsx    # Background animation

# Check for issues
npm run build
npm run lint
```

**Reminder**: Test on mobile Safari after every change!

---

## flavio.superself.online - Personal Portfolio

**Status**: Planning phase
**Domain**: Subdomain of superself.online (configured in Vercel)
**Identity**: Creative Developer / Creative Technologist

### Concept
Personal portfolio showcasing creative code, tools, and projects. Same Win95/DOS aesthetic as main site.

### Planned Sections
- **LAB** - p5.js sketches, interactive experiments
- **PROJECTS** - Web projects, tools, scripts
- **NOTES** - Blog/thoughts (optional)
- **INFO** - About, contact, skills

### Technical Approach
- Same Next.js repo (shared codebase)
- Subdomain routing in Vercel
- Reuse Win95 components from main site

### To Define
- [ ] Which p5.js sketches to include
- [ ] Which tools/scripts to showcase
- [ ] Bio text (Creative Technologist focus)
- [ ] Layout structure

---

## Cleanup Notes

**Stale worktrees** - Can be removed:
```bash
cd E:\WEB+DESIGN\superself.online
git worktree remove ../superself-feature
git worktree remove ../superself-review
```
