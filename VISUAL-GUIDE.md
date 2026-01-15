# superself.online Visual Guide

Windows 95/DOS CLI aesthetic for an electronic music label.

---

## COLORS

| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#0000FF` | Backgrounds, selection, hover text |
| White | `#FFFFFF` | Text, borders, icons |
| Dark Navy | `#000080` | Hover text, Win95 titlebar |
| CLI Grey | `#c0c0c0` | Win95 buttons, nav hover bg |
| Dark Grey | `#808080` | Button shadows, input borders |
| Black | `#000000` | Shadows, borders |
| Panel Grey | `#a8a8a8` | About/Shop panel backgrounds |
| Light Blue | `#1084d0` | Win95 titlebar gradient end |

**Transparency variants:**
- `rgba(255,255,255,0.6)` - Social icons default
- `rgba(255,255,255,0.4)` - Frame border
- `rgba(255,255,255,0.35)` - Copyright text
- `rgba(0,0,0,0.5)` - Panel shadows

---

## TYPOGRAPHY

### Font Stacks
| Use | Stack |
|-----|-------|
| Primary (DOS) | `Fixedsys, Terminal, "Perfect DOS VGA 437", "Lucida Console", Consolas, monospace` |
| Windows UI | `"MS Sans Serif", Arial, sans-serif` |
| Window Titles | `Segoe UI, Tahoma, sans-serif` |

### Font Sizes (responsive)
| Element | Size |
|---------|------|
| Main Title | `clamp(1.5rem, 5vw, 2.5rem)` |
| Nav Items | `clamp(1.1rem, 4vw, 1.4rem)` |
| Panel Text | `clamp(0.85rem, 2.5vw, 1rem)` |
| Copyright | `clamp(0.7rem, 1.5vw, 0.8rem)` |
| Win95 UI | `11px` / `12px` |

---

## SPACING

### Frame
| Element | Value |
|---------|-------|
| Frame border inset | `clamp(50px, 8vw, 60px)` |
| Content inset | `clamp(65px, 10vw, 80px)` |

### Padding
| Element | Value |
|---------|-------|
| Nav items | `4px 8px` |
| Win95 buttons | `3px 20px` |
| Panel content | `0 clamp(16px, 5vw, 28px) clamp(16px, 4vw, 24px)` |

---

## BORDERS & SHADOWS

**Main frame:** `1px solid rgba(255,255,255,0.4)`
**Win95 popup:** `2px solid` (white top-left, black bottom-right)
**Panels:** `2px solid #000`

**Win95 Button shadow (normal):**
```css
inset -1px -1px 0 #0a0a0a,
inset 1px 1px 0 #ffffff,
inset -2px -2px 0 #808080,
inset 2px 2px 0 #dfdfdf
```

**Win95 Button shadow (pressed):**
```css
inset 1px 1px 0 #0a0a0a,
inset -1px -1px 0 #ffffff,
inset 2px 2px 0 #808080,
inset -2px -2px 0 #dfdfdf
```

**Panel shadow:** `4px 4px 0 rgba(0,0,0,0.5)`

---

## ANIMATIONS

### Blink Effects
| Class | Duration |
|-------|----------|
| `.blink` | 0.5s (fast cursor) |
| `.blink-slow` | 0.7s (slow) |
| `.blink-hover` | on hover only |

### Typing Speeds
| Element | Speed |
|---------|-------|
| Title | 60ms/char |
| About text | 50ms/char |
| YES/NO | 80ms/char |

### Boot Sequence Timing
1. Logo appear: 600ms
2. Loader start: +1400ms
3. Confirm phase: +800ms
4. Frame appear: 200ms
5. Title typing: 1500ms
6. Footer appear: 3500ms
7. Welcome popup: 12-15s random

### Dots Animation
- Speed: 400ms per update
- Pattern: `''` → `'.'` → `'..'` → `'...'` → `''`

---

## UI COMPONENTS

### Nav Item (`.nav-cli`)
- Default: White text, transparent bg
- Hover: `#c0c0c0` bg, `#000080` text
- Transition: none (instant)

### Social Icons
- Size: `24px × 24px`
- Default: `rgba(255,255,255,0.6)`
- Hover: `#0000FF` text + white bg

### Win95 Popup
- Background: `#c0c0c0`
- Titlebar: `linear-gradient(90deg, #000080, #1084d0)`
- Draggable: yes

### About/Shop Panel
- Background: `#a8a8a8`
- Border: `2px solid #000`
- Shadow: `4px 4px 0 rgba(0,0,0,0.5)`

---

## Z-INDEX LAYERS

| z-index | Element |
|---------|---------|
| 1 | ASCII Art |
| 10 | UI (title, nav, social) |
| 90 | Panels |
| 150 | Welcome popup |
| 200 | Email toast |

---

## RULES

1. **No accented characters** (DOS font limitation)
2. **No text shadows**
3. **Minimal effects** - clean and authentic
4. **Use `clamp()`** for responsive sizing
5. **Real Japanese characters**, not romaji
6. **Inline critical styles** (prevents CSS race conditions)

---

## FILE LOCATIONS

| File | Contains |
|------|----------|
| `src/app/page.tsx` | Inline styles, animations, UI |
| `src/app/globals.css` | Animations, nav, social icons |
| `src/app/layout.tsx` | Font loading |
| `src/app/AsciiArt.tsx` | Center animation |
| `src/app/LoadingDots.tsx` | Boot progress bar |
