'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { COLORS, WIN_FONT, DISPLAY_FONT, BODY_FONT, SCRAMBLE_CHARS, FRAME_INSETS } from '../constants';
import Toast from '../components/Toast';

// Portfolio translations
const portfolioText = {
  ES: { tagline: 'código + sonido', work: 'proyectos', lab: '+', about: 'info', emailCopied: 'email copiado' },
  EN: { tagline: 'code + sound', work: 'projects', lab: '+', about: 'info', emailCopied: 'email copied' },
  JP: { tagline: 'コード + サウンド', work: 'プロジェクト', lab: '+', about: '情報', emailCopied: 'メールをコピー' },
};

// About section content
const aboutContent = {
  EN: {
    bio: 'Developer + electronic music producer in Lima. Founder of SUPERSELF.',
    skills: ['JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'HTML/CSS', 'Tailwind', 'Git', 'SQL', 'Ableton Live'],
    status: 'Currently available',
    location: 'Lima, Peru',
    email: 'flavio@superself.online',
  },
  ES: {
    bio: 'Desarrollador + productor de música electrónica en Lima. Fundador de SUPERSELF.',
    skills: ['JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'HTML/CSS', 'Tailwind', 'Git', 'SQL', 'Ableton Live'],
    status: 'Actualmente disponible',
    location: 'Lima, Peru',
    email: 'flavio@superself.online',
  },
  JP: {
    bio: 'リマを拠点とする開発者 + 電子音楽プロデューサー。SUPERSELFの創設者。',
    skills: ['JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'HTML/CSS', 'Tailwind', 'Git', 'SQL', 'Ableton Live'],
    status: '現在対応可能',
    location: 'リマ、ペルー',
    email: 'flavio@superself.online',
  },
};

// ASCII Art for "FM" - Minimal blocks style
const ASCII_ART = `
██████╗ ███╗   ███╗
██╔═══╝ ████╗ ████║
█████╗  ██╔████╔██║
██╔══╝  ██║╚██╔╝██║
██║     ██║ ╚═╝ ██║
╚═╝     ╚═╝     ╚═╝
`.trim();

type Language = 'EN' | 'ES' | 'JP';

// Scramble hook matching original superself speed (40ms)
// frames parameter controls reveal duration (more frames = slower reveal)
// key parameter forces re-scramble when incremented (for language changes)
function useScrambleReveal(text: string, trigger: boolean, speed: number = 40, key: number = 0, frames?: number) {
  const [displayed, setDisplayed] = useState('');
  const chars = SCRAMBLE_CHARS.base;

  useEffect(() => {
    if (!trigger) return;

    let frame = 0;
    // Default 18 frames for short text, or use custom frames for longer text
    const maxFrames = frames ?? 18;

    const interval = setInterval(() => {
      frame++;
      const locked = Math.floor((frame / maxFrames) * text.length);

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (i < locked) {
          result += text[i];
        } else if (text[i] === ' ') {
          result += ' ';
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplayed(result);

      if (frame >= maxFrames) {
        setDisplayed(text);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, trigger, speed, chars, key]);

  return displayed;
}

// Scramble dissolve hook - reverse of reveal, scrambles text as it fades out
function useScrambleDissolve(text: string, trigger: boolean, speed: number = 40) {
  const [displayed, setDisplayed] = useState(text);
  const chars = SCRAMBLE_CHARS.base;

  useEffect(() => {
    if (!trigger) {
      setDisplayed(text);
      return;
    }

    let frame = 0;
    const maxFrames = 18;

    const interval = setInterval(() => {
      frame++;
      // Reverse: unlock from the end, scrambling from left to right
      const scrambled = Math.floor((frame / maxFrames) * text.length);

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (i < scrambled) {
          // Already scrambled positions become random chars then empty
          if (frame > maxFrames * 0.7) {
            result += ' ';
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        } else if (text[i] === ' ') {
          result += ' ';
        } else {
          result += text[i];
        }
      }
      setDisplayed(result);

      if (frame >= maxFrames) {
        setDisplayed('');
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, trigger, speed, chars]);

  return displayed;
}

// Typing effect hook
function useTypingEffect(text: string, trigger: boolean, speed: number = 30) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!trigger) {
      setDisplayed('');
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, trigger, speed]);

  return displayed;
}

// CLI-style typewriter - chunky, variable speed, occasional stutter
function useTypewriter(text: string, trigger: boolean, baseSpeed: number = 25) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!trigger) {
      setDisplayed('');
      setDone(false);
      return;
    }

    let index = 0;
    let timeout: NodeJS.Timeout;

    const typeNext = () => {
      if (index >= text.length) {
        setDone(true);
        return;
      }

      // Random chunk size (1-3 chars at once for CLI feel)
      const chunk = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 1;
      index = Math.min(index + chunk, text.length);
      setDisplayed(text.slice(0, index));

      // Variable delay - occasional stutter/pause
      let delay = baseSpeed;
      if (Math.random() > 0.9) delay = baseSpeed * 4; // Occasional long pause
      else if (Math.random() > 0.7) delay = baseSpeed * 0.5; // Sometimes faster

      timeout = setTimeout(typeNext, delay);
    };

    timeout = setTimeout(typeNext, baseSpeed);
    return () => clearTimeout(timeout);
  }, [text, trigger, baseSpeed]);

  return { displayed, done };
}

// About Section Component - Minimal CLI style with white bg
function AboutSection({
  isOpen,
  onClose,
  language
}: {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}) {
  const [asciiPhase, setAsciiPhase] = useState(0); // 0=hidden, 1=glitching, 2=revealed
  const [asciiGlitch, setAsciiGlitch] = useState('');
  const [nameTyped, setNameTyped] = useState('');
  const [namePhase, setNamePhase] = useState(0); // 0=hidden, 1=typing, 2=done
  const [nameGlitched, setNameGlitched] = useState(''); // For random glitch effect
  const [closeHovered, setCloseHovered] = useState(false);
  const [fmHovered, setFmHovered] = useState(false);
  const [scrambledAscii, setScrambledAscii] = useState(ASCII_ART);
  const fmRef = useRef<HTMLPreElement>(null);
  const fmMousePosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  // Individual triggers for each section (random staggered start)
  const [showBio, setShowBio] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showEmailCopied, setShowEmailCopied] = useState(false);
  const [emailToastPos, setEmailToastPos] = useState({ x: 0, y: 0 });

  const content = aboutContent[language];
  const t = portfolioText[language];

  // Email copy handler
  const handleCopyEmail = async (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0]?.clientX || 0 : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY || 0 : e.clientY;

    try {
      await navigator.clipboard.writeText(content.email);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = content.email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setEmailToastPos({ x: clientX, y: clientY });
    setShowEmailCopied(true);
    setTimeout(() => setShowEmailCopied(false), 2000);
  };
  const glitchChars = '█▓▒░╔╗╚╝║═┌┐└┘│─';
  const nameGlitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

  // ASCII glitch effect - slower, gentler reveal
  useEffect(() => {
    if (asciiPhase !== 1) return;

    let frame = 0;
    const maxFrames = 16; // More frames for smoother reveal
    const lines = ASCII_ART.split('\n');

    const interval = setInterval(() => {
      frame++;
      const revealedLines = Math.floor((frame / maxFrames) * lines.length);

      const glitched = lines.map((line, i) => {
        if (i < revealedLines) return line;
        return line.split('').map(c =>
          c === ' ' ? ' ' : glitchChars[Math.floor(Math.random() * glitchChars.length)]
        ).join('');
      }).join('\n');

      setAsciiGlitch(glitched);

      if (frame >= maxFrames) {
        setAsciiPhase(2);
        clearInterval(interval);
      }
    }, 80); // Slower interval

    return () => clearInterval(interval);
  }, [asciiPhase]);

  // FM ASCII localized scramble on hover - continuous update using ref for position
  useEffect(() => {
    if (!fmHovered) {
      setScrambledAscii(ASCII_ART);
      return;
    }

    const lines = ASCII_ART.split('\n');
    const radius = 2; // Character radius for scramble effect

    const interval = setInterval(() => {
      const pos = fmMousePosRef.current;
      const scrambled = lines.map((line, lineIdx) => {
        return line.split('').map((c, charIdx) => {
          if (c === ' ') return ' ';
          // Calculate distance from mouse position (in character units)
          const dist = Math.sqrt(
            Math.pow(charIdx - pos.x, 2) +
            Math.pow(lineIdx - pos.y, 2)
          );
          // Only scramble if within radius
          if (dist < radius) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
          return c;
        }).join('');
      }).join('\n');
      setScrambledAscii(scrambled);
    }, 40); // Faster interval for smoother effect

    return () => clearInterval(interval);
  }, [fmHovered]);

  // Name typewriter effect
  useEffect(() => {
    if (namePhase !== 1) return;

    const name = 'FLAVIO MANYARI';
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setNameTyped(name.slice(0, index));

      if (index >= name.length) {
        setNamePhase(2);
        clearInterval(interval);
      }
    }, 100); // 100ms per character - slower, more deliberate

    return () => clearInterval(interval);
  }, [namePhase]);

  // Random subtle glitch effect on name after typing completes
  useEffect(() => {
    if (namePhase !== 2) {
      setNameGlitched('');
      return;
    }

    const name = 'FLAVIO MANYARI';

    // Random interval between glitches (3-8 seconds)
    const scheduleGlitch = () => {
      const delay = 3000 + Math.random() * 5000;
      return setTimeout(() => {
        // 70% chance to actually glitch
        if (Math.random() > 0.3) {
          // Pick 1-3 random characters to glitch
          const numChars = Math.floor(Math.random() * 3) + 1;
          const positions = new Set<number>();
          while (positions.size < numChars) {
            const pos = Math.floor(Math.random() * name.length);
            if (name[pos] !== ' ') positions.add(pos);
          }

          // Glitch for 80-150ms
          let glitchFrame = 0;
          const glitchDuration = 2 + Math.floor(Math.random() * 3); // 2-4 frames

          const glitchInterval = setInterval(() => {
            glitchFrame++;
            let result = '';
            for (let i = 0; i < name.length; i++) {
              if (positions.has(i)) {
                result += nameGlitchChars[Math.floor(Math.random() * nameGlitchChars.length)];
              } else {
                result += name[i];
              }
            }
            setNameGlitched(result);

            if (glitchFrame >= glitchDuration) {
              setNameGlitched('');
              clearInterval(glitchInterval);
            }
          }, 50);
        }

        // Schedule next glitch
        timeoutRef.current = scheduleGlitch();
      }, delay);
    };

    const timeoutRef = { current: scheduleGlitch() };
    return () => clearTimeout(timeoutRef.current);
  }, [namePhase, nameGlitchChars]);

  // Typewriter for each section - faster, glitchier typing
  const bioTyped = useTypewriter(content.bio, showBio, 25);
  const statusTyped = useTypewriter(content.status, showStatus, 28);
  const locationTyped = useTypewriter(content.location, showLocation, 28);
  const emailTyped = useTypewriter(content.email, showEmail, 28);

  // Sequential entrance - gentle, predictable cascade
  useEffect(() => {
    if (isOpen) {
      // Phase 1: ASCII glitches in (slightly slower)
      const t1 = setTimeout(() => setAsciiPhase(1), 200);
      // Phase 2: Name types in after ASCII settles
      const t2 = setTimeout(() => setNamePhase(1), 1200);

      // Phase 3: Sections cascade in sequence (faster stagger)
      const t3 = setTimeout(() => setShowBio(true), 2200);
      const t4 = setTimeout(() => setShowSkills(true), 2450);
      const t5 = setTimeout(() => setShowStatus(true), 2700);
      const t6 = setTimeout(() => setShowLocation(true), 2900);
      const t7 = setTimeout(() => setShowEmail(true), 3100);
      const t8 = setTimeout(() => setShowLinks(true), 3300);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        clearTimeout(t6);
        clearTimeout(t7);
        clearTimeout(t8);
      };
    } else {
      setAsciiPhase(0);
      setAsciiGlitch('');
      setNamePhase(0);
      setNameTyped('');
      setShowBio(false);
      setShowSkills(false);
      setShowStatus(false);
      setShowLocation(false);
      setShowEmail(false);
      setShowLinks(false);
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cursor = <span className="blink" style={{ color: COLORS.primary }}>_</span>;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: COLORS.secondary,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 'clamp(20px, 4vw, 50px)',
        paddingTop: 'clamp(60px, 10vw, 100px)',
        overflow: 'auto',
        fontFamily: WIN_FONT,
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        onMouseEnter={() => setCloseHovered(true)}
        onMouseLeave={() => setCloseHovered(false)}
        style={{
          position: 'fixed',
          top: 'clamp(20px, 4vw, 50px)',
          right: 'clamp(20px, 4vw, 50px)',
          background: closeHovered ? COLORS.primary : 'transparent',
          border: 'none',
          color: closeHovered ? COLORS.secondary : COLORS.primary,
          fontFamily: WIN_FONT,
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          cursor: 'pointer',
          padding: '0.3em 0.6em',
          letterSpacing: '0.1em',
          opacity: closeHovered ? 1 : 0.7,
          zIndex: 101,
        }}
      >
        [x] close{closeHovered && cursor}
      </button>

      {/* ASCII Art - FM blocks with glitch reveal + localized hover scramble */}
      <pre
        ref={fmRef}
        onMouseEnter={() => setFmHovered(true)}
        onMouseMove={(e) => {
          if (!fmRef.current) return;
          const rect = fmRef.current.getBoundingClientRect();
          const lines = ASCII_ART.split('\n');
          const charWidth = rect.width / (lines[0]?.length || 1);
          const lineHeight = rect.height / lines.length;
          const x = (e.clientX - rect.left) / charWidth;
          const y = (e.clientY - rect.top) / lineHeight;
          fmMousePosRef.current = { x, y };
        }}
        onMouseLeave={() => {
          setFmHovered(false);
          fmMousePosRef.current = { x: -100, y: -100 };
        }}
        style={{
          color: COLORS.primary,
          fontSize: 'clamp(0.5rem, 1.5vw, 1rem)',
          lineHeight: 1.15,
          textAlign: 'center',
          margin: 0,
          marginBottom: '0.5rem',
          visibility: asciiPhase > 0 ? 'visible' : 'hidden',
          minHeight: 'clamp(3rem, 8vw, 6rem)',
          cursor: 'pointer',
        }}
      >
        {asciiPhase === 2 ? scrambledAscii : asciiGlitch}
      </pre>

      {/* Name under ASCII with typewriter reveal + persistent cursor */}
      <div
        style={{
          fontFamily: WIN_FONT,
          fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
          fontWeight: 400,
          color: COLORS.primary,
          letterSpacing: '0.15em',
          marginBottom: 'clamp(2rem, 5vw, 3rem)',
          visibility: namePhase > 0 ? 'visible' : 'hidden',
          minHeight: '1.5em',
        }}
      >
        {nameGlitched || nameTyped}
        <span className="blink">_</span>
      </div>

      {/* Content sections with typewriter */}
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          fontFamily: WIN_FONT,
          fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
          fontWeight: 400,
          lineHeight: 1.8,
        }}
      >
        {/* Bio */}
        {showBio && (
          <div style={{ marginBottom: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
            <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', letterSpacing: '0.2em', color: COLORS.primary, opacity: 0.5, marginBottom: '0.3rem', textTransform: 'uppercase' }}>bio</div>
            <div style={{ color: COLORS.primary }}>{bioTyped.displayed}{!bioTyped.done && cursor}</div>
          </div>
        )}

        {/* Skills */}
        {showSkills && (
          <div style={{ marginBottom: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
            <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', letterSpacing: '0.2em', color: COLORS.primary, opacity: 0.5, marginBottom: '0.3rem', textTransform: 'uppercase' }}>skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {content.skills.map((skill, i) => (
                <span key={skill} className="blink-in glitch-tag skill-tag" style={{
                  padding: '0.15em 0.4em',
                  border: `1px solid ${COLORS.primary}`,
                  fontSize: '0.9em',
                  animationDelay: `${i * 0.03}s`,
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        {showStatus && (
          <div style={{ marginBottom: 'clamp(0.6rem, 1.5vw, 0.9rem)' }}>
            <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', letterSpacing: '0.2em', color: COLORS.primary, opacity: 0.5, marginBottom: '0.3rem', textTransform: 'uppercase' }}>status</div>
            <div style={{ color: COLORS.primary }}>{statusTyped.displayed}{!statusTyped.done && cursor}</div>
          </div>
        )}

        {/* Location */}
        {showLocation && (
          <div style={{ marginBottom: 'clamp(0.6rem, 1.5vw, 0.9rem)' }}>
            <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', letterSpacing: '0.2em', color: COLORS.primary, opacity: 0.5, marginBottom: '0.3rem', textTransform: 'uppercase' }}>location</div>
            <div style={{ color: COLORS.primary }}>{locationTyped.displayed}{!locationTyped.done && cursor}</div>
          </div>
        )}

        {/* Email */}
        {showEmail && (
          <div style={{ marginBottom: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
            <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', letterSpacing: '0.2em', color: COLORS.primary, opacity: 0.5, marginBottom: '0.3rem', textTransform: 'uppercase' }}>email</div>
            <span
              onClick={handleCopyEmail}
              style={{ color: COLORS.primary, textDecoration: 'none', borderBottom: `1px solid ${COLORS.primary}`, cursor: 'pointer' }}
            >
              {emailTyped.displayed}{!emailTyped.done && cursor}
            </span>
          </div>
        )}

        {/* Links - vertical orientation with bigger icons */}
        {showLinks && (
          <div style={{ marginBottom: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
            <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', letterSpacing: '0.2em', color: COLORS.primary, opacity: 0.5, marginBottom: '0.5rem', textTransform: 'uppercase' }}>links</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <a href="https://github.com/9000fm" target="_blank" rel="noopener noreferrer" className="blink-in glitch-tag social-link" style={{ color: COLORS.primary, textDecoration: 'none', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: 'clamp(1rem, 1.8vw, 1.2rem)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                github
              </a>
              <a href="https://www.instagram.com/manyari___/" target="_blank" rel="noopener noreferrer" className="blink-in glitch-tag social-link" style={{ color: COLORS.primary, textDecoration: 'none', opacity: 0.7, animationDelay: '0.04s', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: 'clamp(1rem, 1.8vw, 1.2rem)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                instagram
              </a>
              <a href="https://soundcloud.com/manyari-fm" target="_blank" rel="noopener noreferrer" className="blink-in glitch-tag social-link" style={{ color: COLORS.primary, textDecoration: 'none', opacity: 0.7, animationDelay: '0.08s', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: 'clamp(1rem, 1.8vw, 1.2rem)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
                soundcloud
              </a>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Email copied toast */}
      <Toast
        message={t.emailCopied}
        position={emailToastPos}
        visible={showEmailCopied}
      />
    </div>
  );
}

export default function PortfolioPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showFrame, setShowFrame] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showWork, setShowWork] = useState(false);
  const [showLab, setShowLab] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showBackLink, setShowBackLink] = useState(false);
  const [showLangSwitcher, setShowLangSwitcher] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [bgColor, setBgColor] = useState<string>(COLORS.secondary);
  const [language, setLanguage] = useState<Language>('ES');
  const [backLinkHovered, setBackLinkHovered] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrambleKey, setScrambleKey] = useState(0);
  const [workHovered, setWorkHovered] = useState(false);
  const [labHovered, setLabHovered] = useState(false);
  const [aboutHovered, setAboutHovered] = useState(false);
  const [taglineScrambled, setTaglineScrambled] = useState('');
  const [navScrambled, setNavScrambled] = useState({ work: '', lab: '', about: '' });
  const containerRef = useRef<HTMLDivElement>(null);

  // Exit phase states for staggered animation
  // 0 = not exiting, 1 = back link, 2 = lang switcher, 3 = bottom nav (about),
  // 4 = bottom nav (lab), 5 = bottom nav (work), 6 = tagline, 7 = name, 8 = frame, 9 = bg
  const [exitPhase, setExitPhase] = useState(0);

  // Current text based on language
  const currentText = portfolioText[language];

  // Name uses scramble reveal (matches main superself style)
  const nameRevealed = useScrambleReveal('flavio manyari', showName, 30, 0, 120);

  // Tagline uses scramble reveal with glitchy feel
  const taglineRevealed = useScrambleReveal(currentText.tagline, showTagline, 35, scrambleKey, 25);

  // Scramble dissolves for exit
  const nameDissolve = useScrambleDissolve('flavio manyari', exitPhase >= 7, 40);

  // Display the appropriate text based on exit state
  const name = exitPhase >= 7 ? nameDissolve : nameRevealed;

  // Calculate frame edge proximity for pulse effect
  const edgeProximity = useMemo(() => {
    const threshold = 0.15; // 15% from edge triggers
    const xEdge = Math.min(mousePos.x, 1 - mousePos.x);
    const yEdge = Math.min(mousePos.y, 1 - mousePos.y);
    const closest = Math.min(xEdge, yEdge);
    return closest < threshold ? 1 - (closest / threshold) : 0;
  }, [mousePos]);

  // Handle language change with in-place scramble effect (no fade out/in)
  const handleLanguageChange = (newLang: Language) => {
    if (newLang === language || exitPhase > 0) return;
    setLanguage(newLang);
    setScrambleKey(k => k + 1);  // Trigger re-scramble without hiding
  };

  const handleAboutClose = useCallback(() => {
    setAboutOpen(false);
  }, []);

  // Scramble characters for effects
  const scrambleChars = language === 'JP' ? SCRAMBLE_CHARS.japanese : SCRAMBLE_CHARS.base;

  // Language change scramble effect for tagline and nav items
  useEffect(() => {
    if (scrambleKey === 0) return; // Skip initial mount

    const tagline = currentText.tagline;
    const work = currentText.work;
    const lab = currentText.lab;
    const about = currentText.about;

    let frame = 0;
    const maxFrames = 18;

    const scrambleText = (text: string) => {
      const locked = Math.floor((frame / maxFrames) * text.length);
      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (i < locked) {
          result += text[i];
        } else if (text[i] === ' ') {
          result += ' ';
        } else {
          result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      }
      return result;
    };

    const interval = setInterval(() => {
      frame++;
      setTaglineScrambled(scrambleText(tagline));
      setNavScrambled({
        work: scrambleText(work),
        lab: scrambleText(lab),
        about: scrambleText(about),
      });

      if (frame >= maxFrames) {
        setTaglineScrambled('');
        setNavScrambled({ work: '', lab: '', about: '' });
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [scrambleKey, currentText, scrambleChars]);

  useEffect(() => {
    setMounted(true);

    // Cinematic entrance timing (800-1000ms gaps)
    // 0ms → Frame starts (pulse-ready state)
    // 300ms → Frame fades in
    const frameTimer = setTimeout(() => setShowFrame(true), 300);

    // 1100ms → Name scramble begins (90ms per frame - cinematic)
    const nameTimer = setTimeout(() => setShowName(true), 1100);

    // 2100ms → Tagline scramble begins (90ms per frame)
    const taglineTimer = setTimeout(() => setShowTagline(true), 2100);

    // 3000ms → "work" fades in
    const workTimer = setTimeout(() => setShowWork(true), 3000);

    // 3200ms → "lab" fades in
    const labTimer = setTimeout(() => setShowLab(true), 3200);

    // 3400ms → "about" fades in
    const aboutTimer = setTimeout(() => setShowAbout(true), 3400);

    // 3800ms → Back link fades in
    const backLinkTimer = setTimeout(() => setShowBackLink(true), 3800);

    // 4200ms → Language switcher fades in
    const langTimer = setTimeout(() => setShowLangSwitcher(true), 4200);

    return () => {
      clearTimeout(frameTimer);
      clearTimeout(nameTimer);
      clearTimeout(taglineTimer);
      clearTimeout(workTimer);
      clearTimeout(labTimer);
      clearTimeout(aboutTimer);
      clearTimeout(backLinkTimer);
      clearTimeout(langTimer);
    };
  }, []);

  // Fast exit sequence (~1.4s total)
  const handleExitToSuperself = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (exitPhase > 0) return; // Prevent double-clicks

    // Phase 1: Back link fades (0ms)
    setExitPhase(1);

    // Phase 2: Language switcher fades (100ms)
    setTimeout(() => setExitPhase(2), 100);

    // Phase 3: Bottom nav fades (about first - reverse wave) (200ms)
    setTimeout(() => setExitPhase(3), 200);

    // Phase 4: Bottom nav (lab) (300ms)
    setTimeout(() => setExitPhase(4), 300);

    // Phase 5: Bottom nav (work) (400ms)
    setTimeout(() => setExitPhase(5), 400);

    // Phase 6: Tagline scramble-dissolves (350ms)
    setTimeout(() => setExitPhase(6), 350);

    // Phase 7: Name scramble-dissolves (550ms)
    setTimeout(() => setExitPhase(7), 550);

    // Phase 8: Frame fades (800ms)
    setTimeout(() => setExitPhase(8), 800);

    // Phase 9: Background transitions to blue (1000ms)
    setTimeout(() => {
      setExitPhase(9);
      setBgColor(COLORS.primary);
    }, 1000);

    // Navigate after bg transition completes (1400ms)
    setTimeout(() => {
      router.push('/?skip=1');
    }, 1400);
  };

  // Track mouse for subtle effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  // Subtle gradient shift based on mouse position
  const gradientAngle = 135 + (mousePos.x - 0.5) * 30;

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100dvh',
        backgroundColor: bgColor,
        color: COLORS.primary,
        fontFamily: WIN_FONT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.5s ease-in-out',
      }}
    >
      {/* Subtle gradient overlay that follows mouse */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${gradientAngle}deg,
            rgba(0, 0, 255, 0.03) 0%,
            transparent 50%,
            rgba(0, 0, 255, 0.02) 100%)`,
          pointerEvents: 'none',
          opacity: exitPhase >= 8 ? 0 : 1,
          transition: 'opacity 0.3s ease-in, background 0.3s ease-out',
        }}
      />

      {/* ASCII CLI-style corner borders */}
      {/* Top-left corner with integrated back link */}
      <div
        style={{
          position: 'absolute',
          top: FRAME_INSETS.frame,
          left: FRAME_INSETS.frame,
          fontFamily: WIN_FONT,
          fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
          lineHeight: 1.2,
          color: `rgba(0, 0, 255, 0.5)`,
          opacity: exitPhase >= 8 ? 0 : (showFrame ? 1 : 0),
          transition: 'opacity 0.4s ease-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>╔══</span>
          <a
            href="/?skip=1"
            onClick={handleExitToSuperself}
            onMouseEnter={() => exitPhase === 0 && setBackLinkHovered(true)}
            onMouseLeave={() => setBackLinkHovered(false)}
            onTouchStart={() => exitPhase === 0 && setBackLinkHovered(true)}
            onTouchEnd={() => setBackLinkHovered(false)}
            style={{
              marginLeft: '1em',
              fontSize: 'clamp(0.75rem, 1.4vw, 0.9rem)',
              letterSpacing: '0.1em',
              color: backLinkHovered ? COLORS.secondary : COLORS.primary,
              textDecoration: 'none',
              backgroundColor: backLinkHovered ? COLORS.primary : 'transparent',
              opacity: exitPhase >= 1 ? 0 : (showBackLink ? (backLinkHovered ? 1 : 0.6) : 0),
              padding: '0.1em 0.3em',
              transition: 'opacity 0.25s ease-in, background-color 0.1s, color 0.1s',
              pointerEvents: exitPhase >= 1 ? 'none' : 'auto',
            }}
          >
            ← superself{backLinkHovered && <span className="blink">_</span>}
          </a>
        </div>
        <div>║</div>
      </div>

      {/* Top-right corner */}
      <pre
        style={{
          position: 'absolute',
          top: FRAME_INSETS.frame,
          right: FRAME_INSETS.frame,
          margin: 0,
          fontFamily: WIN_FONT,
          fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
          lineHeight: 1.2,
          color: `rgba(0, 0, 255, 0.5)`,
          textAlign: 'right',
          pointerEvents: 'none',
          opacity: exitPhase >= 8 ? 0 : (showFrame ? 1 : 0),
          transition: 'opacity 0.4s ease-out',
        }}
      >{`══╗\n  ║`}</pre>

      {/* Bottom-left corner */}
      <pre
        style={{
          position: 'absolute',
          bottom: FRAME_INSETS.frameBottom,
          left: FRAME_INSETS.frame,
          margin: 0,
          fontFamily: WIN_FONT,
          fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
          lineHeight: 1.2,
          color: `rgba(0, 0, 255, 0.5)`,
          pointerEvents: 'none',
          opacity: exitPhase >= 8 ? 0 : (showFrame ? 1 : 0),
          transition: 'opacity 0.4s ease-out',
        }}
      >{`║\n╚══`}</pre>

      {/* Bottom-right corner */}
      <pre
        style={{
          position: 'absolute',
          bottom: FRAME_INSETS.frameBottom,
          right: FRAME_INSETS.frame,
          margin: 0,
          fontFamily: WIN_FONT,
          fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
          lineHeight: 1.2,
          color: `rgba(0, 0, 255, 0.5)`,
          textAlign: 'right',
          pointerEvents: 'none',
          opacity: exitPhase >= 8 ? 0 : (showFrame ? 1 : 0),
          transition: 'opacity 0.4s ease-out',
        }}
      >{`  ║\n══╝`}</pre>

      {/* Main content */}
      <main
        style={{
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        {/* Name - pixelated VT323 terminal style */}
        <h1
          style={{
            fontFamily: WIN_FONT,
            fontSize: 'clamp(2.5rem, 9vw, 6rem)',
            fontWeight: 400,
            letterSpacing: '0.08em',
            marginBottom: '0.4em',
            color: COLORS.primary,
            textTransform: 'lowercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            opacity: exitPhase >= 7 ? 0 : (showName ? 1 : 0),
            transform: exitPhase >= 7 ? 'scale(0.98)' : 'scale(1)',
            transition: 'opacity 0.25s ease-in, transform 0.3s ease-in',
          }}
        >
          {name || '\u00A0'}
        </h1>

        {/* Tagline - scramble reveal */}
        <p
          style={{
            fontFamily: WIN_FONT,
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            fontWeight: 400,
            letterSpacing: '0.3em',
            color: COLORS.primary,
            textTransform: 'lowercase',
            opacity: exitPhase >= 6 ? 0 : (showTagline ? 0.7 : 0),
            transform: exitPhase >= 6 ? 'scale(0.98)' : 'scale(1)',
            transition: 'opacity 0.3s ease-in, transform 0.3s ease-in',
          }}
        >
          {taglineScrambled || taglineRevealed || '\u00A0'}
        </p>
      </main>

      {/* Bottom nav */}
      <nav
        style={{
          position: 'absolute',
          bottom: 'clamp(50px, 8vw, 90px)',
          display: 'flex',
          gap: 'clamp(1.5rem, 4vw, 3rem)',
          fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
          letterSpacing: '0.15em',
          textTransform: 'lowercase',
        }}
      >
        <span
          className={showWork && exitPhase < 5 ? 'blink-in' : ''}
          onMouseEnter={() => exitPhase === 0 && setWorkHovered(true)}
          onMouseLeave={() => setWorkHovered(false)}
          style={{
            cursor: 'pointer',
            opacity: exitPhase >= 5 ? 0 : (showWork ? 1 : 0),
            backgroundColor: workHovered ? COLORS.primary : 'transparent',
            color: workHovered ? COLORS.secondary : COLORS.primary,
            padding: '0.3em 0.6em',
            transition: 'background-color 0.1s, color 0.1s',
          }}
        >
          {navScrambled.work || currentText.work}
          <span
            className={workHovered ? 'blink' : ''}
            style={{
              visibility: workHovered ? 'visible' : 'hidden',
              display: 'inline-block',
              width: '0.6em',
            }}
          >_</span>
        </span>
        <span
          className={showLab && exitPhase < 4 ? 'blink-in' : ''}
          onMouseEnter={() => exitPhase === 0 && setLabHovered(true)}
          onMouseLeave={() => setLabHovered(false)}
          style={{
            cursor: 'pointer',
            opacity: exitPhase >= 4 ? 0 : (showLab ? 1 : 0),
            backgroundColor: labHovered ? COLORS.primary : 'transparent',
            color: labHovered ? COLORS.secondary : COLORS.primary,
            padding: '0.3em 0.6em',
            transition: 'background-color 0.1s, color 0.1s',
          }}
        >
          {navScrambled.lab || currentText.lab}
          <span
            className={labHovered ? 'blink' : ''}
            style={{
              visibility: labHovered ? 'visible' : 'hidden',
              display: 'inline-block',
              width: '0.6em',
            }}
          >_</span>
        </span>
        <span
          onClick={() => setAboutOpen(true)}
          className={showAbout && exitPhase < 3 ? 'blink-in' : ''}
          onMouseEnter={() => exitPhase === 0 && setAboutHovered(true)}
          onMouseLeave={() => setAboutHovered(false)}
          style={{
            cursor: 'pointer',
            opacity: exitPhase >= 3 ? 0 : (showAbout ? 1 : 0),
            backgroundColor: aboutHovered ? COLORS.primary : 'transparent',
            color: aboutHovered ? COLORS.secondary : COLORS.primary,
            padding: '0.3em 0.6em',
            transition: 'background-color 0.1s, color 0.1s',
          }}
        >
          {navScrambled.about || currentText.about}
          <span
            className={aboutHovered ? 'blink' : ''}
            style={{
              visibility: aboutHovered ? 'visible' : 'hidden',
              display: 'inline-block',
              width: '0.6em',
            }}
          >_</span>
        </span>
      </nav>


      {/* Language switcher - bottom-left, outside frame, vertical (superself style) */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(30px, 5vw, 60px)',
          left: 'clamp(8px, 2vw, 18px)',
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: 'clamp(16px, 4vw, 24px)',
          fontFamily: WIN_FONT,
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
          opacity: exitPhase >= 2 ? 0 : (showLangSwitcher ? 1 : 0),
          transition: 'opacity 0.2s ease-in',
          pointerEvents: exitPhase >= 2 ? 'none' : 'auto',
          zIndex: 50,
        }}
      >
        {(['ES', 'EN', 'JP'] as Language[]).map((lang) => (
          <div
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              writingMode: 'vertical-lr',
              transform: 'rotate(180deg)',
              color: language === lang ? COLORS.primary : `rgba(0, 0, 255, 0.4)`,
              letterSpacing: '0.04em',
              transition: 'color 0.25s ease',
            }}
          >
            <span>{language === lang ? '■' : '□'}</span>
            <span>{lang}</span>
          </div>
        ))}
      </div>

      {/* About Section Overlay */}
      <AboutSection
        isOpen={aboutOpen}
        onClose={handleAboutClose}
        language={language}
      />
    </div>
  );
}
