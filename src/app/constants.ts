// Brand colors
export const COLORS = {
  primary: '#0000FF',       // Electric blue
  secondary: '#FFFFFF',     // White
  win95Gray: '#c0c0c0',     // Windows 95 gray
  win95DarkGray: '#808080', // Windows 95 dark gray
  win95Navy: '#000080',     // Windows 95 title bar blue
  black: '#000000',
  transparent: 'transparent',
} as const;

// Animation timing values (in milliseconds)
export const TIMING = {
  // Boot sequence
  logoDelay: 600,
  loaderDelay: 1400,
  pauseAfterLoading: 800,

  // Confirm screen
  cursorShowDelay: 300,
  typingStartDelay: 1000,
  typingSpeed: 70,         // Welcome text
  confirmTypingSpeed: 50,  // Question text
  optionTypingSpeed: 80,   // YES/NO options
  dotAnimationSpeed: 300,
  pauseAfterDots: 600,
  pauseBetweenOptions: 200,
  selectorShowDelay: 400,

  // Loading dots (YES transition)
  loadingDotTimings: [300, 600, 900, 1300],
  transitionToMain: 1600,

  // Shutdown sequence
  shutdownDotSpeed: 400,
  shutdownCycleReset: 600,
  shutdownToOff: 4600,
  offToReboot: 6200,

  // Main entrance (normal mode)
  frameShow: 800,
  titleStart: 1500,
  footerShow: 3500,
  burgerShow: 5000,
  welcomePopup: { min: 18000, max: 22000 },

  // Main entrance (skip mode)
  skipFrameShow: 300,
  skipTitleStart: 800,
  skipFooterShow: 1500,
  skipBurgerShow: 2000,
  skipWelcomePopup: 12000,

  // Scramble effects
  scrambleInterval: 40,
  scrambleMaxFrames: 18,
  confirmScrambleInterval: 50,
  confirmScrambleMaxFrames: 15,

  // Title scramble
  normalScrambleSpeed: 55,
  skipScrambleSpeed: 30,
  normalLockMultiplier: 14,
  skipLockMultiplier: 8,

  // Fade transitions
  frameFade: 600,
  footerFade: 1500,
  burgerFade: 600,

  // Toast duration
  toastDuration: 2000,

  // About panel typing
  aboutTypingDelay: 300,
  aboutTypingSpeed: 50,

  // Shop dots animation
  shopDotsSpeed: 400,
} as const;

// Contact information
export const CONTACT = {
  email: 'flavio@superself.online',
  whatsapp: '+51990028077',
  whatsappFormatted: '+51 990 028 077',
  instagram: 'https://www.instagram.com/superself__/',
  soundcloud: 'https://soundcloud.com/superself-music',
} as const;

// Scramble effect characters
export const SCRAMBLE_CHARS = {
  base: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
  japanese: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
} as const;

// Windows 95 style constants
export const WIN95_STYLES = {
  button: {
    backgroundColor: '#c0c0c0',
    border: 'none',
    boxShadow: 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf',
  },
  buttonPressed: {
    backgroundColor: '#c0c0c0',
    border: 'none',
    boxShadow: 'inset 1px 1px 0 #0a0a0a, inset -1px -1px 0 #ffffff, inset 2px 2px 0 #808080, inset -2px -2px 0 #dfdfdf, inset 3px 3px 0 #404040',
  },
  windowBorder: {
    border: '2px solid',
    borderColor: '#ffffff #0a0a0a #0a0a0a #ffffff',
    boxShadow: '1px 1px 0 #000',
  },
  closeButton: {
    width: '22px',
    height: '20px',
    backgroundColor: '#c0c0c0',
    border: 'none',
    boxShadow: 'inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf',
  },
  titlebarGradient: 'linear-gradient(90deg, #000080, #1084d0)',
} as const;

// MS-DOS Executive Pastel Palette (1985 aesthetic)
export const MSDOS = {
  // New Soft Muted Pastel Color Palette - MS-DOS Executive style
  titlePurple: '#B8A9C9',  // soft purple pastel - titlebars (MS-DOS Executive)
  titleBlue: '#B8A9C9',    // alias for titlePurple (backwards compat)
  menuYellow: '#FFF75B',   // yellow - menu bar (MS-DOS Executive style)
  menuCyan: '#FFF75B',     // alias for menuYellow (backwards compat)
  statusYellow: '#FFF75B', // pastel yellow - status bar
  white: '#FFFFFF',        // white - backgrounds
  black: '#000000',        // black - text, borders
  textInverse: '#FFFFFF',  // white - inverse text
  selectionBg: '#000000',  // black - selected item bg
  shadowSoft: '#E6E6E6',   // subtle UI shading

  // Legacy sidebar colors (kept for compatibility but sidebars removed)
  sidebarRed: '#E8C4C4',      // dusty rose
  sidebarPurple: '#D4C4E8',   // soft lavender
  sidebarBlue: '#C4D4E8',     // periwinkle blue

  // Legacy colors for compatibility
  yellow: '#FFF75B',       // Mapped to pastel yellow
  blue: '#B8A9C9',         // Mapped to soft purple
  green: '#FFF75B',        // Mapped to yellow
  red: '#E8C4C4',          // Softer dusty rose
  magenta: '#D4C4E8',      // Soft lavender
  cyan: '#FFF75B',         // Yellow (MS-DOS Executive)
  gray: '#808080',         // Inactive, shadows
  teal: '#FFF75B',         // Desktop background (yellow)

  // Style objects
  titlebar: {
    backgroundColor: '#5761FF',
    color: '#FFFFFF',
    border: '1px solid #000000',
  },
  titlebarInactive: {
    backgroundColor: '#808080',
    color: '#000000',
    border: '1px solid #000000',
  },
  statusBar: {
    backgroundColor: '#FFF75B',
    color: '#000000',
    padding: '2px 8px',
    border: '1px solid #000000',
  },
  menuBar: {
    backgroundColor: '#4CEEEE',
    color: '#000000',
    border: '1px solid #000000',
  },
  menuSelected: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  windowBorder: {
    border: '1px solid #000000',
    boxShadow: 'none',
  },
  button: {
    backgroundColor: '#E6E6E6',
    color: '#000000',
    border: '1px solid #000000',
  },
  buttonPressed: {
    backgroundColor: '#808080',
    color: '#000000',
    border: '1px solid #000000',
  },
} as const;

// Windows 3.1 / MS-DOS Executive 1985 style constants (FLAT - using pastel palette)
export const WIN31 = {
  // Desktop - Yellow (MS-DOS Executive style)
  desktop: '#FFF75B',
  desktopPattern: 'none',
  desktopPatternSize: '0',

  // Colors - MS-DOS Executive Palette
  titlebar: '#B8A9C9',        // Soft purple pastel (MS-DOS Executive)
  titlebarText: '#FFFFFF',
  windowBg: '#FFFFFF',        // White background
  contentBg: '#FFFFFF',
  border: '#000000',
  highlight: '#FFFFFF',
  shadow: '#E6E6E6',
  buttonFace: '#E6E6E6',

  // Styles - FLAT 1985 style (no inset shadows!)
  button: {
    backgroundColor: '#E6E6E6',
    border: '1px solid #000000',
  },
  buttonPressed: {
    backgroundColor: '#808080',
    border: '1px solid #000000',
  },
  buttonHover: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  windowBorder: {
    border: '1px solid #000000',  // Simple 1px border
  },
  controlButton: {
    width: '16px',
    height: '14px',
    backgroundColor: '#E6E6E6',
    border: '1px solid #000000',
  },
  menuItem: {
    padding: '2px 20px 2px 8px',
    cursor: 'pointer',
  },
  menuItemHover: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #000000',
  },
} as const;

// Font stacks for typography hierarchy
export const WIN_FONT = 'var(--font-terminal), VT323, Fixedsys, Terminal, Consolas, monospace';
export const DISPLAY_FONT = 'var(--font-display), "Space Mono", Consolas, monospace';
export const BODY_FONT = 'var(--font-body), "IBM Plex Mono", Consolas, monospace';

// Frame insets with safe-area support
export const FRAME_INSETS = {
  frame: 'max(clamp(30px, 5vw, 60px), env(safe-area-inset-top, 0px))',
  frameBottom: 'max(clamp(30px, 5vw, 60px), env(safe-area-inset-bottom, 0px))',
  content: 'max(clamp(45px, 7vw, 80px), env(safe-area-inset-top, 0px))',
  contentBottom: 'max(clamp(45px, 7vw, 80px), env(safe-area-inset-bottom, 0px))',
} as const;

// Spinner animation frames
export const SPINNER_CHARS = ['|', '/', '-', '\\'] as const;
